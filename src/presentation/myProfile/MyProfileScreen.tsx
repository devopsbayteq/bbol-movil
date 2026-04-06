import {useMemo,} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, type ThemeColors} from '../../providers';
import {Lexend} from '../../theme/lexend';
import {UserAvatarIcon} from '../home/components/HomeIcons';
import {
    ProfileBankIcon,
    ProfileGaugeIcon,
    ProfileLockIcon,
    ProfileSmartphoneCheckIcon,
} from './ProfileMenuIcons';
import {useMyProfileViewModel} from './useMyProfileViewModel';
import {ProfileMenuRow} from "./components/ProfileMenuRow.tsx";
import {DevelopmentNoticeModal} from "../components";

export function MyProfileScreen() {
    const {colors} = useTheme();
    const styles = useStyles(colors);
    const {
        displayName,
        avatarInitial,
        lastConnectionLabel,
        showDevelopmentMode,
        setShowDevelopmentMode
    } =
        useMyProfileViewModel();

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>
                <Text style={styles.screenTitle}>Perfil</Text>

                <View style={styles.userStrip}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarLetter}>{avatarInitial}</Text>
                    </View>
                    <Text style={styles.userName}>{displayName.toUpperCase()}</Text>
                    <Text style={styles.lastConnection}>{lastConnectionLabel}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeading}>Información personal</Text>
                    <View style={styles.card}>
                        <ProfileMenuRow
                            onPress={()=>{setShowDevelopmentMode(true)}}
                            colors={colors}
                            isFirst
                            isLast
                            icon={<UserAvatarIcon color={colors.primary}/>}
                            label="Datos personales"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeading}>Configuración</Text>
                    <View style={styles.card}>
                        <ProfileMenuRow
                            onPress={()=>{setShowDevelopmentMode(true)}}
                            colors={colors}
                            isFirst
                            icon={<ProfileBankIcon color={colors.primary}/>}
                            label="Cuentas"
                        />
                        <View style={styles.cardDivider}/>
                        <ProfileMenuRow
                            onPress={()=>{setShowDevelopmentMode(true)}}
                            colors={colors}
                            isLast
                            icon={<ProfileLockIcon color={colors.primary}/>}
                            label="Seguridad"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeading}>Salud financiera</Text>
                    <View style={styles.card}>
                        <ProfileMenuRow
                            onPress={()=>{setShowDevelopmentMode(true)}}
                            colors={colors}
                            isFirst
                            isLast
                            icon={<ProfileGaugeIcon color={colors.primary}/>}
                            label="Calificación Crediticia"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeading}>Experiencia en el app</Text>
                    <View style={styles.card}>
                        <ProfileMenuRow
                            onPress={()=>{setShowDevelopmentMode(true)}}
                            colors={colors}
                            isFirst
                            isLast
                            icon={
                                <ProfileSmartphoneCheckIcon color={colors.primary}/>
                            }
                            label="Nuevas funcionalidades"
                        />
                    </View>
                </View>
                <DevelopmentNoticeModal visible={showDevelopmentMode} onClose={()=>{setShowDevelopmentMode(false)}}/>
            </ScrollView>
        </SafeAreaView>
    );
}

function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                safe: {
                    flex: 1,
                    backgroundColor: colors.background,
                },
                scroll: {
                    flex: 1,
                },
                scrollContent: {
                    paddingBottom: 32,
                },
                screenTitle: {
                    fontFamily: Lexend.bold,
                    fontSize: 22,
                    lineHeight: 28,
                    color: colors.textPrimary,
                    paddingHorizontal: 20,
                    paddingTop: 8,
                    paddingBottom: 16,
                },
                userStrip: {
                    backgroundColor: colors.primaryLight,
                    paddingVertical: 24,
                    paddingHorizontal: 20,
                    marginBottom: 24,
                    alignItems: 'center',
                },
                avatarCircle: {
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12,
                },
                avatarLetter: {
                    fontFamily: Lexend.bold,
                    fontSize: 28,
                    color: colors.white,
                },
                userName: {
                    fontFamily: Lexend.bold,
                    fontSize: 18,
                    lineHeight: 24,
                    color: colors.textPrimary,
                    textAlign: 'center',
                    marginBottom: 8,
                },
                lastConnection: {
                    fontFamily: Lexend.regular,
                    fontSize: 13,
                    lineHeight: 18,
                    color: colors.textTertiary,
                    textAlign: 'center',
                },
                section: {
                    marginBottom: 20,
                    paddingHorizontal: 20,
                },
                sectionHeading: {
                    fontFamily: Lexend.semiBold,
                    fontSize: 15,
                    lineHeight: 22,
                    color: colors.textPrimary,
                    marginBottom: 10,
                },
                card: {
                    borderRadius: 10,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    overflow: 'hidden',
                },
                cardDivider: {
                    height: 0.6,
                    backgroundColor: colors.borderLight,
                },
            }),
        [colors],
    );
}
