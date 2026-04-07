import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  Image,
  Platform,
} from 'react-native';

import {useTheme, type ThemeColors} from '../../providers';
import {Button} from '../components';
import {Lexend} from '../../theme/lexend';

const successIllustration = require('../../../assets/images/device-registration-success.png');
const shieldKeyholeIcon = require('../../../assets/images/shield-keyhole.png');

const AUTO_DISMISS_MS = 5000;

interface DeviceRegistrationSuccessModalProps {
  visible: boolean;
  onContinue: () => Promise<void>;
}

export function DeviceRegistrationSuccessModal({
  visible,
  onContinue,
}: DeviceRegistrationSuccessModalProps) {
  const {colors} = useTheme();
  const styles = useStyles(colors);
  const onContinueRef = useRef(onContinue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doneRef = useRef(false);
  onContinueRef.current = onContinue;

  const runContinue = useCallback(() => {
    if (doneRef.current) {
      return;
    }
    doneRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onContinueRef.current().catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible) {
      return;
    }
    doneRef.current = false;
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      runContinue();
    }, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, runContinue]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={runContinue}>
      <View style={styles.root}>
        <View style={styles.modalHeader}>
          <View style={styles.headerSpacer} />
          <Text style={styles.modalTitle} accessibilityRole="header">
            ¡TODO LISTO!
          </Text>
          <Pressable
            onPress={runContinue}
            hitSlop={12}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Cerrar">
            <Text style={styles.closeIcon}>×</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <Image
            source={successIllustration}
            style={styles.hero}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={styles.bodyText}>
            Tu nuevo dispositivo ha sido registrado, estás listo para ingresar a
            tu Banca móvil.
          </Text>
          <Button
            title="Iniciar sesión"
            onPress={runContinue}
            variant="loginPrimary"
            iconSourceRight={shieldKeyholeIcon}
            iconRightTintColor={colors.white}
            testID="device-registration-success-continue"
          />
        </View>
      </View>
    </Modal>
  );
}

function useStyles(colors: ThemeColors) {
  return useMemo(
    () =>
      StyleSheet.create({
        root: {
          flex: 1,
          backgroundColor: colors.background,
        },
        modalHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          minHeight: 56,
          backgroundColor: colors.white,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.borderLight,
        },
        headerSpacer: {
          width: 40,
        },
        modalTitle: {
          flex: 1,
          fontFamily: Lexend.bold,
          fontSize: 16,
          lineHeight: 24,
          color: colors.textPrimary,
          textAlign: 'center',
        },
        closeBtn: {
          width: 40,
          alignItems: 'flex-end',
          justifyContent: 'center',
        },
        closeIcon: {
          fontSize: 28,
          lineHeight: 32,
          color: colors.textPrimary,
          fontWeight: '400',
        },
        body: {
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: Platform.OS === 'ios' ? 32 : 24,
        },
        hero: {
          width: '100%',
          height: 160,
          marginBottom: 20,
        },
        bodyText: {
          fontFamily: Lexend.regular,
          fontSize: 16,
          lineHeight: 26,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 28,
        },
      }),
    [colors],
  );
}
