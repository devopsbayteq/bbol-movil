import {useHomeViewModel} from '../../home/useHomeViewModel.ts';

export const useTransferInitViewModel = () => {
  const {data, isLoading, error, retry} = useHomeViewModel();

  const isBetweenOwnAccountsEnabled = true;
  const isThirdPartyEnabled = false;

  return {
    data,
    isLoading,
    error,
    retry,
    isBetweenOwnAccountsEnabled,
    isThirdPartyEnabled,
  };
};
