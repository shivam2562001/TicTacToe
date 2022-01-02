import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Cell from './src/components/Cell';
import SplashScreen from 'react-native-splash-screen';

const emptyMap = [
  ['', '', ''], // 1st row
  ['', '', ''], // 2nd row
  ['', '', ''], // 3rd row
];

const copyArray = original => {
  const copy = original.map(arr => {
    return arr.slice();
  });

  return copy;
};

export default function App() {
  const [map, setMap] = useState(emptyMap);
  const [currentTurn, setCurrentTurn] = useState('x');
  const [gameMode, setGameMode] = useState('BOT_MEDIUM'); // LOCAL, BOT_EASY, BOT_MEDIUM;
  const [xwins, setXWins] = useState(0);
  const [owins, setOWins] = useState(0);
  const [gameinProgress, setGameInProgress] = useState(false);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (currentTurn === 'o' && gameMode !== 'LOCAL') {
      botTurn();
    }
  }, [currentTurn, gameMode]);

  useEffect(() => {
    const winner = getWinner(map);
    if (winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  }, [map]);

  const onPress = (rowIndex, columnIndex) => {
    if (map[rowIndex][columnIndex] !== '') {
      Alert.alert('Position already occupied');
      return;
    }

    setMap(existingMap => {
      const updatedMap = [...existingMap];
      updatedMap[rowIndex][columnIndex] = currentTurn;
      return updatedMap;
    });
    if (!gameinProgress) setGameInProgress(true);
    setCurrentTurn(currentTurn === 'x' ? 'o' : 'x');
  };

  const getWinner = winnerMap => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      const isRowXWinning = winnerMap[i].every(cell => cell === 'x');
      const isRowOWinning = winnerMap[i].every(cell => cell === 'o');

      if (isRowXWinning) {

        return 'x';
      }
      if (isRowOWinning) {
        return 'o';
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      let isColumnXWinner = true;
      let isColumnOWinner = true;

      for (let row = 0; row < 3; row++) {
        if (winnerMap[row][col] !== 'x') {
          isColumnXWinner = false;
        }
        if (winnerMap[row][col] !== 'o') {
          isColumnOWinner = false;
        }
      }

      if (isColumnXWinner) {
        return 'x';
      }
      if (isColumnOWinner) {
        return 'o';
      }
    }

    // check diagonals
    let isDiagonal1OWinning = true;
    let isDiagonal1XWinning = true;
    let isDiagonal2OWinning = true;
    let isDiagonal2XWinning = true;
    for (let i = 0; i < 3; i++) {
      if (winnerMap[i][i] !== 'o') {
        isDiagonal1OWinning = false;
      }
      if (winnerMap[i][i] !== 'x') {
        isDiagonal1XWinning = false;
      }

      if (winnerMap[i][2 - i] !== 'o') {
        isDiagonal2OWinning = false;
      }
      if (winnerMap[i][2 - i] !== 'x') {
        isDiagonal2XWinning = false;
      }
    }

    if (isDiagonal1OWinning || isDiagonal2OWinning) {
      return 'o';
    }
    if (isDiagonal1XWinning || isDiagonal2XWinning) {
      return 'x';
    }
  };

  const checkTieState = () => {
    if (!map.some(row => row.some(cell => cell === ''))) {
      setTotalMatches(totalMatches + 1);

      Alert.alert(`It's a tie`, `tie`, [
        {
          text: 'Restart',
          onPress: resetGame,
        },
      ]);
    }
  };

  const gameWon = player => {
    if (player == 'x') setXWins(xwins + 1);
    else setOWins(owins + 1);
    setTotalMatches(totalMatches + 1);
    Alert.alert(`Huraaay!!!`, `Player ${player} won`, [
      {
        text: 'Restart',
        onPress: resetGame,
      },
    ]);
  };

  const resetGame = () => {
    setMap([
      ['', '', ''], // 1st row
      ['', '', ''], // 2nd row
      ['', '', ''], // 3rd row
    ]);
    setCurrentTurn('x');
    setGameInProgress(false);
  };

  const botTurn = () => {
    // collect all possible options
    const possiblePositions = [];
    map.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === '') {
          possiblePositions.push({row: rowIndex, col: columnIndex});
        }
      });
    });

    let chosenOption;

    if (gameMode === 'BOT_MEDIUM') {
      // Attack
      possiblePositions.forEach(possiblePosition => {
        const mapCopy = copyArray(map);

        mapCopy[possiblePosition.row][possiblePosition.col] = 'o';

        const winner = getWinner(mapCopy);
        if (winner === 'o') {
          // Attack that position
          chosenOption = possiblePosition;
        }
      });

      if (!chosenOption) {
        // Defend
        // Check if the opponent WINS if it takes one of the possible Positions
        possiblePositions.forEach(possiblePosition => {
          const mapCopy = copyArray(map);

          mapCopy[possiblePosition.row][possiblePosition.col] = 'x';

          const winner = getWinner(mapCopy);
          if (winner === 'x') {
            // Defend that position
            chosenOption = possiblePosition;
          }
        });
      }
    }

    // choose random
    if (!chosenOption) {
      chosenOption =
        possiblePositions[Math.floor(Math.random() * possiblePositions.length)];
    }

    if (chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',alignItems: 'center',marginVertical:10}}>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
          }}>
          Current Turn : {currentTurn.toUpperCase()}
        </Text>
        {gameMode === 'LOCAL' && !gameinProgress && (
        <TouchableOpacity
          onPress={() => setCurrentTurn(turn => (turn == 'x' ? 'o' : 'x'))}
          style={{
            marginLeft: 60
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
            }}>
            Toggle Turn
          </Text>
        </TouchableOpacity>
      )}<>
      {  gameinProgress && 
      <TouchableOpacity
          onPress={() => resetGame()}
          style={{
            marginLeft: 60
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
            }}>
           RESET
          </Text>
        </TouchableOpacity>}
      </>
      </View>
      <View style={{flexDirection:'row',alignItems:'space-between',marginVertical:20}}>
        <View style={{marginRight:50,}}>
        <Text
          style={{
            fontSize: 18,
            color: 'white',
          }}>
          X wins : {xwins} times
        </Text>
        </View>
        <View>
        <Text
          style={{
            fontSize: 18,
            color: 'white',
          }}>
          O wins : {owins} times
        </Text>
        </View>
      </View>

      <View style={{flexDirection:'row',alignItems: 'center',marginBottom:30}}>
        <Text
          style={{
            fontSize: 20,
            color: 'white',
          }}>
          Total Attempts : {totalMatches}
        </Text>
      </View>

      {/*setting turn*/}
    

      <View style={styles.map}>
        {map.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[rowIndex == 2 ? styles.rowend : styles.row]}>
            {row.map((cell, columnIndex) => (
              <Cell
                key={`row-${rowIndex}-col-${columnIndex}`}
                cell={cell}
                index={columnIndex}
                onPress={() => onPress(rowIndex, columnIndex)}
              />
            ))}
          </View>
        ))}
      </View>

      <View style={styles.buttons}>
        <Text
          onPress={() => setGameMode('LOCAL')}
          style={[
            styles.button,
            {backgroundColor: gameMode === 'LOCAL' ? '#4F5686' : '#191F24'},
          ]}>
          Local
        </Text>
        <Text
          onPress={() => setGameMode('BOT_EASY')}
          style={[
            styles.button,
            {
              backgroundColor: gameMode === 'BOT_EASY' ? '#4F5686' : '#191F24',
            },
          ]}>
          Easy Bot
        </Text>
        <Text
          onPress={() => setGameMode('BOT_MEDIUM')}
          style={[
            styles.button,
            {
              backgroundColor:
                gameMode === 'BOT_MEDIUM' ? '#4F5686' : '#191F24',
            },
          ]}>
          Medium Bot
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0C294B',
  },
  bg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  map: {
    width: '80%',
    aspectRatio: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 10,
    borderBottomColor: '#42EAB7',
    borderRadius: 5,
  },
  rowend: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0,
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  button: {
    color: 'white',
    margin: 10,
    fontSize: 16,
    backgroundColor: '#191F24',
    padding: 10,
    paddingHorizontal: 15,
  },
});
