const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = class AuthControler {
  static login(req, res) {
    res.render("auth/login");
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash("message", "Usuario ou senha invalido.");
      res.render("auth/login");
      return;
    }
    const passwordMatch = bcrypt.compareSync(password, user.password); // usa a senha que veio do formulario com a senha cadastrada no banco, nesta ordem
    if (!passwordMatch) {
      req.flash("message", "Usuario ou senha invalido.");
      res.render("auth/login");
      return;
    }
    req.session.userid = user.id;
    req.session.save(() => {
      res.redirect("/");
    });
  }

  static register(req, res) {
    res.render("auth/register");
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    const checkUserExist = await User.findOne({ where: { email: email } });

    if (checkUserExist) {
      req.flash("message", "E-mail ja cadastrado, tente outro e-mail.");
      res.render("auth/register");
      //res.redirect('/login')
      return;
    }
    if (password != confirmpassword) {
      req.flash("message", "As senhas nao conferem. Tente novamente!");
      res.render("auth/register");
      return;
    }

    const salt = bcrypt.genSaltSync(10); // acrescenta 10 caracteres randomicos a senha para dificultar a quebra de senha por hackers
    const hashedPassword = bcrypt.hashSync(password, salt); // aqui ele cria a criptografia na senha usando o salt e a senha digitada pelo usuario

    const user = {
      name,
      email,
      password: hashedPassword,
    };
    try {
      //await User.create({name,email,password:hashedPassword})tambem poderia fazer assim, com os campos passados separadamente ou criando um objeto e passando o objeto
      const createdUser = await User.create(user);

      req.session.userid = createdUser.id; // estou passando para a sessao o id do usuario

      req.flash("message", "Cadastro realizado com sucesso!");

      req.session.save(() => {
        //antes de redirecionar eu salvo a sessao
        res.redirect("/");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  }
};
