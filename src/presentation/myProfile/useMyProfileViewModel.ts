import {useCallback, useMemo, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../providers';

const MONTH_LABELS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const;

function formatLastConnection(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTH_LABELS[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `Última conexión: ${day} ${month}. ${year} | ${hours}:${minutes}`;
}

function firstGraphemeUpper(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return '?';
  }
  const first = [...trimmed][0];
  return first ? first.toUpperCase() : '?';
}

export function useMyProfileViewModel() {

  const {user} = useAuth();
  const [connectionTime, setConnectionTime] = useState(() => new Date());
  const [showDevelopmentMode,setShowDevelopmentMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setConnectionTime(new Date());
    }, []),
  );

  const displayName = useMemo(() => {
    const raw = user?.name?.trim();
    return raw && raw.length > 0 ? raw : 'Usuario';
  }, [user?.name]);

  const avatarInitial = useMemo(
    () => firstGraphemeUpper(displayName),
    [displayName],
  );

  const lastConnectionLabel = useMemo(
    () => formatLastConnection(connectionTime),
    [connectionTime],
  );

  return {
    displayName,
    avatarInitial,
    lastConnectionLabel,
    showDevelopmentMode,
    setShowDevelopmentMode
  };
}
