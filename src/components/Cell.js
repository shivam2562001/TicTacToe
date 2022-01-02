import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Cross from "./Cross";

const Cell = (props) => {
  const { cell, onPress,index } = props;
  return (
    <Pressable
      onPress={() => onPress()}
      style={[index== 2 ?styles.cellEnd:styles.cell]}
    >
      {cell === "o" && <View style={styles.circle} />}
      {cell === "x" && <Cross />}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    flex: 1,
    borderRightWidth:10,
    borderRightColor:'#42EAB7'
  },
  cellEnd: {
    width: 100,
    height: 100,
    flex: 1,
  },
  circle: {
    flex: 1,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,

    borderWidth: 10,
    borderColor: "white",
  },
});

export default Cell;
