import { create } from 'zustand';

type OrganizationScope = 'school_management' | 'student_organization';

type SiteUiState = {
    mobileNavOpen: boolean;
    organizationScope: OrganizationScope;
    selectedTourSceneId: string;
    setMobileNavOpen: (open: boolean) => void;
    setOrganizationScope: (scope: OrganizationScope) => void;
    setSelectedTourSceneId: (sceneId: string) => void;
};

export const useSiteUiStore = create<SiteUiState>((set) => ({
    mobileNavOpen: false,
    organizationScope: 'school_management',
    selectedTourSceneId: 'gerbang-utama',
    setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
    setOrganizationScope: (scope) => set({ organizationScope: scope }),
    setSelectedTourSceneId: (sceneId) => set({ selectedTourSceneId: sceneId }),
}));
