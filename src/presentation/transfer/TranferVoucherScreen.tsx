import {StyleSheet, View} from "react-native";
import {ThemeColors, useTheme} from "../../providers";
import React, {useMemo} from "react";
import {ToolbarApp} from "./components/ToolbarApp.tsx";

export const TransferVoucherScreen = ()=>{
    const {colors} = useTheme()
    const styles = useStyles(colors)
    return(
        <View style={styles.root} testID="transfer-main-screen">
            <ToolbarApp
                title={"COMPROBANTE"}
                onBackPress={() => {

                }}/>
        </View>
    )
}


function useStyles(colors: ThemeColors) {
    return useMemo(
        () =>
            StyleSheet.create({
                root: {
                    flex: 1,
                    backgroundColor: colors.background,
                },}),[colors])
}
