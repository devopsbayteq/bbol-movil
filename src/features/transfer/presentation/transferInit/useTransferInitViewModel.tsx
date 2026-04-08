import {useHomeViewModel} from '../home/useHomeViewModel';

export const useTransferInitViewModel = () => {
  const {data, isLoading, error, retry} = useHomeViewModel();

  const isBetweenOwnAccountsEnabled = (data?.accounts.length ?? 0) >= 2;
  const isThirdPartyEnabled = false

  return {
    data,
    isLoading,
    error,
    retry,
    isBetweenOwnAccountsEnabled,
    isThirdPartyEnabled,
  };
};
