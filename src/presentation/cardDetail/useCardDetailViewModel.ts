import {useMemo} from 'react';
import {useQuery} from '@tanstack/react-query';
import {useDI} from '../../di';
import type {CreditCardBalance} from '../../domain/entities/ContractBalance';
import {HOME_CONTRACT_BALANCE_QUERY_KEY} from '../home/useHomeViewModel';
import {
  EXTRA_DEMO_CREDIT_CARDS_FOR_DETAIL,
  MOCK_CARD_CONSUMPTIONS,
  MOCK_SPENDING_CATEGORIES,
  resolveApprovedCreditLimit,
} from './cardDetailMocks';

export interface CardDetailResolved {
  card: CreditCardBalance;
  approvedLimit: number;
  utilized: number;
  available: number;
  utilizationRatio: number;
}

export function useCardDetailViewModel(maskedCardNumber: string | undefined) {
  const {getHomeContractBalanceUseCase} = useDI();

  const query = useQuery({
    queryKey: HOME_CONTRACT_BALANCE_QUERY_KEY,
    queryFn: () => getHomeContractBalanceUseCase.execute(),
  });

  const cardsForCarousel: CardDetailResolved[] = useMemo(() => {
    if (!query.data) {
      return [];
    }
    const apiCards = query.data.creditCards ?? [];
    const allCards: CreditCardBalance[] = [
      ...apiCards,
      ...EXTRA_DEMO_CREDIT_CARDS_FOR_DETAIL,
    ];
    if (allCards.length === 0) {
      return [];
    }
    return allCards.map(card => {
      const approvedLimit = resolveApprovedCreditLimit(card.totalDue);
      const utilized = Math.min(card.totalDue, approvedLimit);
      const available = Math.max(0, approvedLimit - utilized);
      const utilizationRatio =
        approvedLimit > 0 ? Math.min(1, utilized / approvedLimit) : 0;
      return {
        card,
        approvedLimit,
        utilized,
        available,
        utilizationRatio,
      };
    });
  }, [query.data]);

  const resolved: CardDetailResolved | null = useMemo(() => {
    if (!maskedCardNumber || cardsForCarousel.length === 0) {
      return null;
    }
    return (
      cardsForCarousel.find(c => c.card.maskedCardNumber === maskedCardNumber) ??
      null
    );
  }, [cardsForCarousel, maskedCardNumber]);

  return {
    cardsForCarousel,
    resolved,
    isLoading: query.isLoading,
    errorMessage: query.error?.message ?? '',
    consumptions: MOCK_CARD_CONSUMPTIONS,
    spendingCategories: MOCK_SPENDING_CATEGORIES,
  };
}
