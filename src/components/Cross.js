import React from "react";
import { View, StyleSheet } from "react-native";

const Cross = () => {
  return (
    <View style={styles.cross}>
      <View style={styles.crossLine} />
      <View style={[styles.crossLine, styles.crossLineReversed]} />
    </View>
  );
};

const styles = StyleSheet.create({
  cross: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  crossLine: {
    position: "absolute",
    left: "48%",
    width: 8,
    height: "80%",
    backgroundColor: "white",
    borderRadius: 5,
    transform: [
      {
        rotate: "45deg",
      },
    ],
  },
  crossLineReversed: {
    transform: [
      {
        rotate: "-45deg",
      },
    ],
  },
});

export default Cross;
