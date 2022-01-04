import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import NumberContainer from "../components/NumberContainer";
import TitleText from "../components/TitleText";
import Card from "../components/Card";
import MainButton from "../components/MainButton";
import BodyText from "../components/BodyText";

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const randNum = Math.floor(Math.random() * (max - min)) + min;
  if (randNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return randNum;
  }
};

const renderListItem = (value, numOfRound) => {
  return (
    <View style={styles.listItem} key={value}>
      <BodyText># {numOfRound}</BodyText>
      <BodyText>{value}</BodyText>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const GameScreen = (props) => {
  const { userChoice, onGameOver } = props;

  const initialGuess = generateRandomBetween(1, 100, userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess]);
  const [renderLandscape, setRenderLandscape] = useState(false);

  const currentLow = useRef(1);
  const currentHigh = useRef(100);

  useEffect(() => {
    const checkLandscape = () => {
      if (Dimensions.get("window").height < 500) {
        setRenderLandscape(true);
      } else {
        setRenderLandscape(false);
      }
    }

    const dimensionsListener = Dimensions.addEventListener("change", checkLandscape);

    return () => dimensionsListener.remove();
  }, [])

  useEffect(() => {
    if (currentGuess === userChoice) {
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = (direction) => {
    if (
      (direction === "LOWER" && currentGuess < userChoice) ||
      (direction === "HIGHER" && currentGuess > userChoice)
    ) {
      Alert.alert("Don't Lie", "You know that this is wrong...", [
        { text: "Sorry", style: "cancel" },
      ]);
      return;
    }
    if (direction === "LOWER") {
      currentHigh.current = currentGuess;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextNumber);
    setPastGuesses((currPastGuesses) => [nextNumber, ...currPastGuesses]);
  };

  if (renderLandscape) {
    return (
      <View style={styles.screen}>
        <TitleText>Opponent's Guess</TitleText>
        <View style={styles.controls}>
          <MainButton
            onPress={() => {
              nextGuessHandler("LOWER");
            }}
          >
            <FontAwesome name="arrow-down" size={30} color="white" />
          </MainButton>
          <NumberContainer>{currentGuess}</NumberContainer>
          <MainButton
            onPress={() => {
              nextGuessHandler("HIGHER");
            }}
          >
            <FontAwesome name="arrow-up" size={30} color="white" />
          </MainButton>
        </View>

        <View style={styles.list}>
          <ScrollView>
            {pastGuesses.map((guess, index) =>
              renderListItem(guess, pastGuesses.length - index)
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <TitleText>Opponent's Guess</TitleText>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <MainButton
          onPress={() => {
            nextGuessHandler("LOWER");
          }}
        >
          <FontAwesome name="arrow-down" size={30} color="white" />
        </MainButton>
        <MainButton
          onPress={() => {
            nextGuessHandler("HIGHER");
          }}
        >
          <FontAwesome name="arrow-up" size={30} color="white" />
        </MainButton>
      </Card>
      <View style={styles.list}>
        <ScrollView>
          {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: height > 600 ? 20 : 10,
    width: 400,
    maxWidth: "90%",
  },
  list: {
    width: width > 350 ? "70%" : "80%",
    flex: 1,
  },
  listItem: {
    borderColor: "#ccc",
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    alignItems: "center"
  },
});

export default GameScreen;
