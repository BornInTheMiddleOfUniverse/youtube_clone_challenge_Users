import User from "./models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join!" });
};

export const postJoin = async (req, res) => {
  const { username, password, password2, email, location } = req.body;

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMesssage: "username already taken(이미 사용 중인 사용자이름입니다.)",
    });
  }

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage:
        "wrong password confirmation(비밀번호가 일치하지 않습니다.)",
    });
  }

  try {
    const createdUser = await User.create({
      username,
      password,
      email,
      location,
    });

    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .render("login", {
        pageTitle: "Login",
        errorMessage:
          "User with this username does not exists. (해당 유저가 없습니다.)",
      });
  }

  const ok = bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "wrong password(비밀번호가 틀렸습니다.)",
    });
  }

  req.session.loggedIn = true;
  req.session.loggedInUser = user;
  return res.redirect("/");
};

export const home = async (req, res) => {
  const loggedInUser = req.session.loggedInUser;
  if (loggedInUser) {
    return res.render("home", { loggedInUser });
  } else {
    return res.redirect("/login");
  }
};
