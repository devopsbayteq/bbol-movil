import {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ScreenGuardModule, {useSGScreenRecord} from 'react-native-screenguard';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import type {RootStackParamList} from '../../navigation/AppNavigator';
import {ToolbarApp} from '../transfer/components/ToolbarApp';
import {CalendarIcon} from '../home/components/HomeIcons';
import {SpacerView} from "../components/SpacerView.tsx";

let sessionScreenGuardProtectionEnabled = false;

export function SecurityMenuScreen() {
    const {colors} = useTheme();
    const styles = useStyles(colors);

    const navigation = useNavigation<NativeStackNavigationProp<
        RootStackParamList,
        'SecurityMenu'>>();

    const [screenGuardReady, setScreenGuardReady] = useState(false);
    const [isProtectionEnabled, setIsProtectionEnabled] = useState(
        () => sessionScreenGuardProtectionEnabled,
    );
    const [isToggling, setIsToggling] = useState(false);

    useSGScreenRecord(event => {
        if (event.isRecording) {
            Alert.alert(
                'Grabación de pantalla',
                'Se detectó que la grabación de pantalla está activa. Por seguridad, evita mostrar datos sensibles.',
            );
        }
    });

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                await ScreenGuardModule.initSettings({
                    enableCapture: true,
                    enableRecord: true,
                    displayScreenGuardOverlay: false,
                    displayScreenguardOverlayAndroid: true,
                    timeAfterResume: 2000,
                    getScreenshotPath: false,
                });
                if (!cancelled) {
                    setScreenGuardReady(true);
                }
            } catch {
                if (!cancelled) {
                    setScreenGuardReady(false);
                    Alert.alert(
                        'Protección de pantalla',
                        'No se pudo inicializar la protección. Cierra la app e inténtalo de nuevo.',
                    );
                }
            }
        };

        init().catch(() => undefined);

        return () => {
            cancelled = true;
        };
    }, []);

    const applyProtection = useCallback(async (enabled: boolean) => {
        if (!screenGuardReady) {
            return;
        }
        setIsToggling(true);
        try {
            if (enabled) {
                await ScreenGuardModule.registerWithBlurView({
                    radius: 50,
                });
                sessionScreenGuardProtectionEnabled = true;
                setIsProtectionEnabled(true);
            } else {
                await ScreenGuardModule.unregister();
                sessionScreenGuardProtectionEnabled = false;
                setIsProtectionEnabled(false);
            }
        } catch {
            Alert.alert(
                'Protección de pantalla',
                enabled
                    ? 'No se pudo activar el bloqueo de capturas.'
                    : 'No se pudo desactivar el bloqueo de capturas.',
            );
        } finally {
            setIsToggling(false);
        }
    }, [screenGuardReady]);

    const onToggleProtection = useCallback(
        (next: boolean) => {
            applyProtection(next).catch(() => undefined);
        },
        [applyProtection],
    );

    return (
        <View style={styles.root}>
            <ToolbarApp
                title="Seguridad"
                onBackPress={() => {
                    navigation.pop();
                }}
            />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.sectionTitle}>Bloqueo de capturas de pantalla</Text>
                    <View style={styles.card}>
                        <CalendarIcon color={colors.primary} size={24}/>
                        <View style={styles.cardTextCol}>
                            <Text style={styles.cardTitle}>
                                {isProtectionEnabled ? 'Activado' : 'Desactivado'}
                            </Text>
                            <Text style={styles.cardSubtitle}>
                                Dificulta capturas y grabaciones no autorizadas de la pantalla de la app
                            </Text>
                        </View>
                        <Switch
                            value={isProtectionEnabled}
                            onValueChange={onToggleProtection}
                            disabled={!screenGuardReady || isToggling}
                            trackColor={{
                                false: colors.border,
                                true: colors.primaryLight,
                            }}
                            thumbColor={colors.white}
                            ios_backgroundColor={colors.border}
                        />
                    </View>
                </View>
                <SpacerView/>
                <Pressable
                onPress={_ => {}}>
                <View>
                    <Text style={styles.sectionTitle}>Activar huella biométrica.</Text>
                    <View style={styles.card}>
                        <Image
                            style={styles.icon}
                            source={require("../../../assets/images/fingerprint.png")}
                        />
                        <View style={styles.cardTextCol}>
                            <Text style={styles.cardSubtitle}>
                                Activa la biometría para acceder de forma rápida y segura usando tu huella o reconocimiento facial.
                            </Text>
                        </View>
                    </View>
                </View>
                </Pressable>
            </ScrollView>
        </View>
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
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 32,
                },
                sectionTitle: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 15,
                    lineHeight: 22,
                    color: colors.textPrimary,
                    marginBottom: 10,
                },
                card: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                },
                cardTextCol: {
                    flex: 1,
                    marginLeft: 12,
                    minWidth: 0,
                },
                cardTitle: {
                    fontFamily: Lexend.regular,
                    fontSize: 14,
                    lineHeight: 22,
                    color: colors.textPrimary,
                    marginBottom: 4,
                },
                cardSubtitle: {
                    fontFamily: Lexend.regular,
                    fontSize: 12,
                    lineHeight: 18,
                    color: colors.textTertiary,
                },
                icon: {
                    width: 45,
                    height: 45,
                }
            }),
        [colors],
    );
}
