import {create} from 'zustand';

interface HomeSessionUiState {
  /** Oculta el carrusel de banners en Home hasta el próximo login. */
  homeBannersDismissedForSession: boolean;
  dismissHomeBannersForSession: () => void;
  resetHomeSessionUi: () => void;
}

export const useHomeSessionUiStore = create<HomeSessionUiState>(set => ({
  homeBannersDismissedForSession: false,
  dismissHomeBannersForSession: () => set({homeBannersDismissedForSession: true}),
  resetHomeSessionUi: () => set({homeBannersDismissedForSession: false}),
}));
