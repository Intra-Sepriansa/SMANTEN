export type SchoolValueStatement = {
    key: string;
    label: string;
    valueText: string;
    description: string | null;
};

export type SchoolProfilePayload = {
    name: string;
    officialName: string;
    npsn: string;
    accreditation: string;
    curriculumName: string | null;
    studyScheduleType: string | null;
    principalName: string | null;
    operatorName: string | null;
    email: string | null;
    phone: string | null;
    websiteUrl: string | null;
    address: string;
    location: {
        latitude: number;
        longitude: number;
    };
    landAreaSquareMeters: number;
    studentCount: number;
    teachingGroupCount: number;
    physicalClassroomCount: number;
    laboratoryCount: number;
    libraryCount: number;
    staffCount: number;
    valueStatements: SchoolValueStatement[];
};

export type PpdbTrackQuota = {
    trackType: string;
    quotaPercentage: number;
    quotaSeats: number;
};

export type PpdbPayload = {
    id: number;
    name: string;
    status: string;
    capacity: number;
    schoolLatitude: number;
    schoolLongitude: number;
    zoneRadiusKm: number;
    applicationOpensAt: string | null;
    applicationClosesAt: string | null;
    announcementAt: string | null;
    rulesSnapshot: Record<string, unknown>;
    trackQuotas: PpdbTrackQuota[];
} | null;

export type FeaturedWork = {
    id: number;
    title: string;
    slug: string;
    itemType: string;
    summary: string | null;
    priceEstimate: string | number | null;
    publishedAt: string | null;
    projectTitle: string | null;
    themeName: string | null;
    creatorName: string | null;
    imageUrl: string | null;
};

export type FeaturedArticle = {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    authorName: string | null;
    publishedAt: string | null;
    source?: string | null;
    imageUrl?: string | null;
};

export type OrganizationNode = {
    id: number;
    unit: string | null;
    unitSlug?: string | null;
    scope: string;
    position: string | null;
    positionSlug?: string | null;
    hierarchyLevel?: number | null;
    name: string | null;
    biography: string | null;
    startsAt: string | null;
    isCurrent: boolean;
    sortOrder?: number | null;
};

export type HistoricalOrganizationEntry = {
    id: number;
    scope: string;
    unit: string | null;
    unitSlug?: string | null;
    position: string | null;
    positionSlug?: string | null;
    name: string | null;
    biography: string | null;
    status: string | null;
    startsAt: string | null;
    endsAt: string | null;
    periodLabel: string;
};

export type ExtracurricularVideoItem = {
    id: string;
    title: string;
    category: string;
    description: string | null;
    state: string;
    provider: string | null;
    externalUrl: string | null;
    thumbnailUrl: string | null;
    publishedAt: string | null;
};

export type GeocodeCandidate = {
    displayName: string;
    name: string | null;
    type: string | null;
    latitude: number;
    longitude: number;
    address: {
        road?: string | null;
        village?: string | null;
        district?: string | null;
        city?: string | null;
        province?: string | null;
    };
};

export type VirtualTourHotspot = {
    id: string;
    label: string;
    targetSceneId: string;
    yaw: number;
    pitch: number;
};

export type VirtualTourScene = {
    id: string;
    title: string;
    eyebrow: string;
    description: string;
    imageUrl: string;
    accentColor: string;
    initialYaw: number;
    facts: string[];
    hotspots: VirtualTourHotspot[];
};

export type AlumniSpotlight = {
    id: number;
    slug?: string | null;
    url?: string | null;
    fullName: string;
    graduationYear: number;
    institutionName: string | null;
    occupationTitle: string | null;
    city: string | null;
    province: string | null;
    bio: string | null;
    storyCount?: number;
    isVerified?: boolean;
    mentorshipBadge?: boolean;
    hiringBadge?: boolean;
    location?: { latitude: number; longitude: number } | null;
    locationMapUrl?: string | null;
};

export type ForumComment = {
    id: number;
    authorName: string;
    body: string;
    createdAt: string | null;
};

export type AlumniProfileSummary = {
    id: number;
    slug?: string | null;
    url?: string | null;
    fullName: string;
    graduationYear: number | null;
    institutionName: string | null;
    occupationTitle: string | null;
    city: string | null;
    province: string | null;
    bio: string | null;
    isVerified?: boolean;
    mentorshipBadge?: boolean;
    hiringBadge?: boolean;
    storyCount?: number;
    location?: { latitude: number; longitude: number } | null;
    locationMapUrl?: string | null;
};

export type ForumPost = {
    id: number;
    slug?: string | null;
    detailUrl?: string | null;
    authorName: string;
    graduationYear: number;
    category: 'cerita' | 'karir' | 'kampus' | 'inspirasi';
    title: string;
    excerpt?: string | null;
    body: string;
    institutionName: string | null;
    occupationTitle: string | null;
    city: string | null;
    province: string | null;
    likesCount: number;
    viewsCount: number;
    commentsCount?: number;
    bookmarksCount?: number;
    shareCount?: number;
    reportsCount?: number;
    isFeatured: boolean;
    moderationStatus?: string;
    isOpenToMentor?: boolean;
    hasHiringInfo?: boolean;
    createdAt: string | null;
    updatedAt?: string | null;
    profile?: AlumniProfileSummary | null;
    comments?: ForumComment[];
    viewerState?: {
        liked: boolean;
        bookmarked: boolean;
        reported: boolean;
        shared: boolean;
    };
    isVerified?: boolean;
    mentorshipBadge?: boolean;
    hiringBadge?: boolean;
    location?: { latitude: number; longitude: number } | null;
    locationMapUrl?: string | null;
};
