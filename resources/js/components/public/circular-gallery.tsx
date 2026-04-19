import {
    Camera,
    Mesh,
    Plane,
    Program,
    Renderer,
    Texture,
    Transform,
} from 'ogl';
import { useEffect, useRef } from 'react';

type GL = Renderer['gl'];

export type CircularGalleryItem = {
    image: string;
    text: string;
};

type CircularGalleryProps = {
    items?: CircularGalleryItem[];
    bend?: number;
    textColor?: string;
    borderRadius?: number;
    font?: string;
    scrollSpeed?: number;
    scrollEase?: number;
    className?: string;
};

function debounce<T extends (...args: never[]) => void>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function lerp(start: number, end: number, amount: number): number {
    return start + (end - start) * amount;
}

function getFontSize(font: string): number {
    const match = font.match(/(\d+)px/);

    return match ? Number.parseInt(match[1], 10) : 30;
}

function createTextTexture(
    gl: GL,
    text: string,
    font: string,
    color: string,
): { texture: Texture; width: number; height: number } {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Could not get 2d context');
    }

    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = Math.ceil(metrics.width);
    const fontSize = getFontSize(font);
    const textHeight = Math.ceil(fontSize * 1.2);

    canvas.width = textWidth + 24;
    canvas.height = textHeight + 24;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = font;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new Texture(gl, { generateMipmaps: false });
    texture.image = canvas;

    return {
        texture,
        width: canvas.width,
        height: canvas.height,
    };
}

class GalleryTitle {
    private gl: GL;
    private plane: Mesh;
    private text: string;
    private textColor: string;
    private font: string;
    private textureWidth = 1;
    private textureHeight = 1;
    mesh!: Mesh;

    constructor({
        gl,
        plane,
        text,
        textColor,
        font,
    }: {
        gl: GL;
        plane: Mesh;
        text: string;
        textColor: string;
        font: string;
    }) {
        this.gl = gl;
        this.plane = plane;
        this.text = text;
        this.textColor = textColor;
        this.font = font;

        this.createMesh();
    }

    private createMesh(): void {
        const { texture, width, height } = createTextTexture(
            this.gl,
            this.text,
            this.font,
            this.textColor,
        );
        this.textureWidth = width;
        this.textureHeight = height;
        const geometry = new Plane(this.gl);
        const program = new Program(this.gl, {
            vertex: `
                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragment: `
                precision highp float;

                uniform sampler2D tMap;
                varying vec2 vUv;

                void main() {
                    vec4 color = texture2D(tMap, vUv);

                    if (color.a < 0.1) {
                        discard;
                    }

                    gl_FragColor = color;
                }
            `,
            uniforms: {
                tMap: { value: texture },
            },
            transparent: true,
        });

        this.mesh = new Mesh(this.gl, { geometry, program });
        this.mesh.setParent(this.plane);
        this.onResize();
    }

    onResize(): void {
        const aspect = this.textureWidth / this.textureHeight;
        const textHeightScaled = this.plane.scale.y * 0.14;
        const textWidthScaled = textHeightScaled * aspect;

        this.mesh.scale.set(textWidthScaled, textHeightScaled, 1);
        this.mesh.position.y =
            -this.plane.scale.y * 0.5 - textHeightScaled * 0.6 - 0.08;
    }
}

class GalleryMedia {
    private geometry: Plane;
    private gl: GL;
    private image: string;
    private index: number;
    private length: number;
    private scene: Transform;
    private screen: { width: number; height: number };
    private viewport: { width: number; height: number };
    private bend: number;
    private textColor: string;
    private borderRadius: number;
    private font: string;
    private text: string;
    private extra = 0;
    private title?: GalleryTitle;
    private scale = 0;
    private padding = 2;
    private width = 0;
    private widthTotal = 0;
    private x = 0;
    private speed = 0;
    private isBefore = false;
    private isAfter = false;
    plane!: Mesh;
    program!: Program;

    constructor({
        geometry,
        gl,
        image,
        index,
        length,
        scene,
        screen,
        text,
        viewport,
        bend,
        textColor,
        borderRadius,
        font,
    }: {
        geometry: Plane;
        gl: GL;
        image: string;
        index: number;
        length: number;
        scene: Transform;
        screen: { width: number; height: number };
        text: string;
        viewport: { width: number; height: number };
        bend: number;
        textColor: string;
        borderRadius: number;
        font: string;
    }) {
        this.geometry = geometry;
        this.gl = gl;
        this.image = image;
        this.index = index;
        this.length = length;
        this.scene = scene;
        this.screen = screen;
        this.text = text;
        this.viewport = viewport;
        this.bend = bend;
        this.textColor = textColor;
        this.borderRadius = borderRadius;
        this.font = font;

        this.createShader();
        this.createMesh();
        this.onResize();
        this.createTitle();
    }

    private createShader(): void {
        const texture = new Texture(this.gl, {
            generateMipmaps: true,
        });

        this.program = new Program(this.gl, {
            depthTest: false,
            depthWrite: false,
            vertex: `
                precision highp float;

                attribute vec3 position;
                attribute vec2 uv;
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                uniform float uSpeed;
                uniform float uTime;
                varying vec2 vUv;

                void main() {
                    vUv = uv;

                    vec3 transformed = position;
                    transformed.z = (
                        sin(transformed.x * 4.0 + uTime) * 1.5 +
                        cos(transformed.y * 2.0 + uTime) * 1.5
                    ) * (0.1 + uSpeed * 0.5);

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                }
            `,
            fragment: `
                precision highp float;

                uniform vec2 uImageSizes;
                uniform vec2 uPlaneSizes;
                uniform sampler2D tMap;
                uniform float uBorderRadius;
                varying vec2 vUv;

                float roundedBoxSDF(vec2 point, vec2 size, float radius) {
                    vec2 distance = abs(point) - size;
                    return length(max(distance, vec2(0.0))) +
                        min(max(distance.x, distance.y), 0.0) - radius;
                }

                void main() {
                    vec2 ratio = vec2(
                        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
                        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
                    );

                    vec2 uv = vec2(
                        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );

                    vec4 color = texture2D(tMap, uv);
                    float distance = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
                    float edgeSmooth = 0.002;
                    float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, distance);

                    gl_FragColor = vec4(color.rgb, alpha);
                }
            `,
            uniforms: {
                tMap: { value: texture },
                uPlaneSizes: { value: [0, 0] },
                uImageSizes: { value: [1, 1] },
                uSpeed: { value: 0 },
                uTime: { value: 100 * Math.random() },
                uBorderRadius: { value: this.borderRadius },
            },
            transparent: true,
        });

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = this.image;
        image.onload = () => {
            texture.image = image;
            this.program.uniforms.uImageSizes.value = [
                image.naturalWidth,
                image.naturalHeight,
            ];
        };
    }

    private createMesh(): void {
        this.plane = new Mesh(this.gl, {
            geometry: this.geometry,
            program: this.program,
        });
        this.plane.setParent(this.scene);
    }

    private createTitle(): void {
        this.title = new GalleryTitle({
            gl: this.gl,
            plane: this.plane,
            text: this.text,
            textColor: this.textColor,
            font: this.font,
        });
    }

    update(
        scroll: { current: number; last: number },
        direction: 'left' | 'right',
    ): void {
        this.plane.position.x = this.x - scroll.current - this.extra;

        const x = this.plane.position.x;
        const halfViewport = this.viewport.width / 2;

        if (this.bend === 0) {
            this.plane.position.y = 0;
            this.plane.rotation.z = 0;
        } else {
            const absoluteBend = Math.abs(this.bend);
            const radius =
                (halfViewport * halfViewport + absoluteBend * absoluteBend) /
                (2 * absoluteBend);
            const effectiveX = Math.min(Math.abs(x), halfViewport);
            const arc =
                radius - Math.sqrt(radius * radius - effectiveX * effectiveX);

            if (this.bend > 0) {
                this.plane.position.y = -arc;
                this.plane.rotation.z =
                    -Math.sign(x) * Math.asin(effectiveX / radius);
            } else {
                this.plane.position.y = arc;
                this.plane.rotation.z =
                    Math.sign(x) * Math.asin(effectiveX / radius);
            }
        }

        this.speed = scroll.current - scroll.last;
        this.program.uniforms.uTime.value += 0.04;
        this.program.uniforms.uSpeed.value = this.speed;

        const planeOffset = this.plane.scale.x / 2;
        const viewportOffset = this.viewport.width / 2;

        this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
        this.isAfter = this.plane.position.x - planeOffset > viewportOffset;

        if (direction === 'right' && this.isBefore) {
            this.extra -= this.widthTotal;
            this.isBefore = false;
            this.isAfter = false;
        }

        if (direction === 'left' && this.isAfter) {
            this.extra += this.widthTotal;
            this.isBefore = false;
            this.isAfter = false;
        }
    }

    onResize({
        screen,
        viewport,
    }: {
        screen?: { width: number; height: number };
        viewport?: { width: number; height: number };
    } = {}): void {
        if (screen) {
            this.screen = screen;
        }

        if (viewport) {
            this.viewport = viewport;
        }

        this.scale = this.screen.height / 1500;
        this.plane.scale.y =
            (this.viewport.height * (900 * this.scale)) / this.screen.height;
        this.plane.scale.x =
            (this.viewport.width * (700 * this.scale)) / this.screen.width;
        this.program.uniforms.uPlaneSizes.value = [
            this.plane.scale.x,
            this.plane.scale.y,
        ];

        this.padding = 2;
        this.width = this.plane.scale.x + this.padding;
        this.widthTotal = this.width * this.length;
        this.x = this.width * this.index;
        this.title?.onResize();
    }
}

class CircularGalleryApp {
    private container: HTMLDivElement;
    private scrollSpeed: number;
    private scroll: {
        ease: number;
        current: number;
        target: number;
        last: number;
        position: number;
    };
    private onCheckDebounce: () => void;
    private renderer!: Renderer;
    private gl!: GL;
    private camera!: Camera;
    private scene!: Transform;
    private planeGeometry!: Plane;
    private medias: GalleryMedia[] = [];
    private mediasImages: CircularGalleryItem[] = [];
    private screen!: { width: number; height: number };
    private viewport!: { width: number; height: number };
    private raf = 0;
    private isPointerDown = false;
    private start = 0;

    constructor(
        container: HTMLDivElement,
        {
            items,
            bend = 3,
            textColor = '#ffffff',
            borderRadius = 0.05,
            font = '700 30px Figtree, sans-serif',
            scrollSpeed = 2,
            scrollEase = 0.05,
        }: Omit<CircularGalleryProps, 'className'>,
    ) {
        this.container = container;
        this.scrollSpeed = scrollSpeed;
        this.scroll = {
            ease: scrollEase,
            current: 0,
            target: 0,
            last: 0,
            position: 0,
        };
        this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);

        this.createRenderer();
        this.createCamera();
        this.createScene();
        this.createGeometry();
        this.onResize();
        this.createMedias(items, bend, textColor, borderRadius, font);
        this.addEventListeners();
        this.update();
    }

    private createRenderer(): void {
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
            dpr: Math.min(window.devicePixelRatio || 1, 2),
        });

        this.gl = this.renderer.gl;
        this.gl.clearColor(0, 0, 0, 0);
        this.container.appendChild(this.gl.canvas as HTMLCanvasElement);
    }

    private createCamera(): void {
        this.camera = new Camera(this.gl);
        this.camera.fov = 45;
        this.camera.position.z = 20;
    }

    private createScene(): void {
        this.scene = new Transform();
    }

    private createGeometry(): void {
        this.planeGeometry = new Plane(this.gl, {
            heightSegments: 50,
            widthSegments: 100,
        });
    }

    private createMedias(
        items: CircularGalleryItem[] | undefined,
        bend: number,
        textColor: string,
        borderRadius: number,
        font: string,
    ): void {
        const defaultItems: CircularGalleryItem[] = [
            {
                image: 'https://picsum.photos/seed/circular-gallery-01/1200/900?grayscale',
                text: 'Bridge',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-02/1200/900?grayscale',
                text: 'Desk Setup',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-03/1200/900?grayscale',
                text: 'Waterfall',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-04/1200/900?grayscale',
                text: 'Strawberries',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-05/1200/900?grayscale',
                text: 'Deep Diving',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-06/1200/900?grayscale',
                text: 'Train Track',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-07/1200/900?grayscale',
                text: 'Santorini',
            },
            {
                image: 'https://picsum.photos/seed/circular-gallery-08/1200/900?grayscale',
                text: 'Blurry Lights',
            },
        ];
        const galleryItems = items && items.length > 0 ? items : defaultItems;

        this.mediasImages = galleryItems.concat(galleryItems);
        this.medias = this.mediasImages.map((item, index) => {
            return new GalleryMedia({
                geometry: this.planeGeometry,
                gl: this.gl,
                image: item.image,
                index,
                length: this.mediasImages.length,
                scene: this.scene,
                screen: this.screen,
                text: item.text,
                viewport: this.viewport,
                bend,
                textColor,
                borderRadius,
                font,
            });
        });
    }

    private onPointerDown(clientX: number): void {
        this.isPointerDown = true;
        this.scroll.position = this.scroll.current;
        this.start = clientX;
        this.container.classList.add('is-dragging');
    }

    private onPointerMove(clientX: number): void {
        if (!this.isPointerDown) {
            return;
        }

        const distance = (this.start - clientX) * (this.scrollSpeed * 0.025);
        this.scroll.target = this.scroll.position + distance;
    }

    private onPointerUp = (): void => {
        this.isPointerDown = false;
        this.container.classList.remove('is-dragging');
        this.onCheck();
    };

    private onWheel = (event: WheelEvent): void => {
        event.preventDefault();

        const delta = event.deltaY || event.deltaX;
        this.scroll.target +=
            (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
        this.onCheckDebounce();
    };

    private onMouseDown = (event: MouseEvent): void => {
        this.onPointerDown(event.clientX);
    };

    private onMouseMove = (event: MouseEvent): void => {
        this.onPointerMove(event.clientX);
    };

    private onTouchStart = (event: TouchEvent): void => {
        this.onPointerDown(event.touches[0].clientX);
    };

    private onTouchMove = (event: TouchEvent): void => {
        if (event.cancelable) {
            event.preventDefault();
        }

        this.onPointerMove(event.touches[0].clientX);
    };

    private onCheck(): void {
        const firstMedia = this.medias[0];

        if (!firstMedia) {
            return;
        }

        const itemWidth = firstMedia.plane.scale.x + 2;
        const itemIndex = Math.round(Math.abs(this.scroll.target) / itemWidth);
        const snappedItem = itemWidth * itemIndex;
        this.scroll.target =
            this.scroll.target < 0 ? -snappedItem : snappedItem;
    }

    private onResize = (): void => {
        this.screen = {
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        };

        this.renderer.setSize(this.screen.width, this.screen.height);
        this.camera.perspective({
            aspect: this.screen.width / this.screen.height,
        });

        const fov = (this.camera.fov * Math.PI) / 180;
        const viewportHeight = 2 * Math.tan(fov / 2) * this.camera.position.z;
        const viewportWidth = viewportHeight * this.camera.aspect;

        this.viewport = {
            width: viewportWidth,
            height: viewportHeight,
        };

        this.medias.forEach((media) =>
            media.onResize({
                screen: this.screen,
                viewport: this.viewport,
            }),
        );
    };

    private update = (): void => {
        this.scroll.current = lerp(
            this.scroll.current,
            this.scroll.target,
            this.scroll.ease,
        );

        const direction =
            this.scroll.current > this.scroll.last ? 'right' : 'left';

        this.medias.forEach((media) => media.update(this.scroll, direction));
        this.renderer.render({ scene: this.scene, camera: this.camera });

        this.scroll.last = this.scroll.current;
        this.raf = window.requestAnimationFrame(this.update);
    };

    private addEventListeners(): void {
        this.container.addEventListener('wheel', this.onWheel, {
            passive: false,
        });
        this.container.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('mouseup', this.onPointerUp);

        this.container.addEventListener('touchstart', this.onTouchStart, {
            passive: true,
        });
        window.addEventListener('touchmove', this.onTouchMove, {
            passive: false,
        });
        window.addEventListener('touchend', this.onPointerUp);
        window.addEventListener('resize', this.onResize);
    }

    destroy(): void {
        window.cancelAnimationFrame(this.raf);
        this.container.removeEventListener('wheel', this.onWheel);
        this.container.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('mouseup', this.onPointerUp);
        this.container.removeEventListener('touchstart', this.onTouchStart);
        window.removeEventListener('touchmove', this.onTouchMove);
        window.removeEventListener('touchend', this.onPointerUp);
        window.removeEventListener('resize', this.onResize);

        if (this.gl.canvas.parentNode === this.container) {
            this.container.removeChild(this.gl.canvas as HTMLCanvasElement);
        }
    }
}

export default function CircularGallery({
    items,
    bend = 3,
    textColor = '#ffffff',
    borderRadius = 0.05,
    font = '700 30px Figtree, sans-serif',
    scrollSpeed = 2,
    scrollEase = 0.05,
    className,
}: CircularGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const app = new CircularGalleryApp(containerRef.current, {
            items,
            bend,
            textColor,
            borderRadius,
            font,
            scrollSpeed,
            scrollEase,
        });

        return () => {
            app.destroy();
        };
    }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

    return (
        <div
            ref={containerRef}
            aria-label="Galeri foto melingkar"
            className={[
                'h-full w-full cursor-grab overflow-hidden active:cursor-grabbing',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        />
    );
}
