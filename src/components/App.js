import { useEffect, useReducer } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./About";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import questionsData from "./data/questions.json";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import "../index.css";

const SECS_PER_QUESTION = 5;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.secondsRemaining === 0
            ? state.points > state.highscore
              ? state.points
              : state.highscore
            : state.highscore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unkonwn");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    dispatch({
      type: "dataReceived",
      payload: questionsData.questions,
    });
  }, []);

  return (
    <Router>
      <div className="wrapper">
        <div className="app">
  
          <nav style={{ marginBottom: "2rem" }}>
            <Link to="/" style={{ marginRight: "2rem",textDecoration :"none",color:"#1f618d",fontSize:"30px",
fontWeight:"bold"}}>Home</Link>
            <Link to="/about" style={{textDecoration :"none",color:"#1f618d",fontSize:"30px",
fontWeight:"bold"}}>About</Link>
          </nav>
          <div className="headerWrapper">
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <Main>
                    {status === "loading" && <Loader />}
                    {status === "error" && <Error />}
                    {status === "ready" && (
                      <StartScreen
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                        creator="Altamash Kabir 22BCE0536"
                      />
                    )}
  
                    {status === "active" && (
                      <>
                        <Progress
                          index={index}
                          numQuestions={numQuestions}
                          points={points}
                          maxPossiblePoints={maxPossiblePoints}
                          answer={answer}
                        />
                        <Question
                          question={questions[index]}
                          dispatch={dispatch}
                          answer={answer}
                        />
                        <Footer>
                          <Timer
                            dispatch={dispatch}
                            secondsRemaining={secondsRemaining}
                          />
                          <NextButton
                            dispatch={dispatch}
                            answer={answer}
                            numQuestions={numQuestions}
                            index={index}
                          />
                        </Footer>
                      </>
                    )}
  
                    {status === "finished" && (
                      <FinishScreen
                        points={points}
                        maxPossiblePoints={maxPossiblePoints}
                        highscore={highscore}
                        dispatch={dispatch}
                      />
                    )}
                  </Main>
                }
              />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
