function StartScreen({dispatch}) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>Created by Altamash Kabir 22BCE0536</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
