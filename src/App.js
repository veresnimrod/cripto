import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Opinion from "./Pages/Opinion";
import Crypto from "./Pages/Crypto";
import { Auth } from "./Pages/Auth";
import { AuthContextProvider } from "./Components/Auth.context";
import { Profile } from "./Pages/Profile";
import { News } from "./Pages/News";
import { Survey } from "./Pages/Survey";
import Notfound from "./Pages/Notfound";

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/crypto" exact component={Crypto} />
            <Route path="/cryptoS" component={Opinion} />
            <Route path="/news" component={News} />
            <Route path="/login" component={Auth} />
            <Route path="/register" component={Auth} />
            <Route path="/profile" component={Profile} />
            <Route path="/opinion" component={Survey} />
            <Route component={Notfound} />
          </Switch>
        </Router>
      </AuthContextProvider>
    </div>
  );
}
export default App;
