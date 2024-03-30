const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize"); // esse op, eu posso fazer consultas que contenham determinada palavra em qualquer lugar do campo de texto

module.exports = class ToughtsController {
  static async showToughts(req, res) {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";
    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [["createdAt", order]], // o primeiro order, é o comando do sequelize para ordernar por ascendente ou descendente, é o order by do SQL, ja o segundo order, e a variavel que criamos e iremos passar ali DESC ou ASC
    });
    let toughtsQty = toughtsData.length;
    console.log(
      `numero de registro encontrado no banco sem nenhuma busca ${toughtsQty}`
    );
    if (toughtsQty === 0) {
      // preciso testar se achou algum resultado e caso nao ache nada, transformar o toughtsQty em false, para testar no front-end, pois o handlebars nao entende falso como zero, por isso tenho que coloca-lo como falso caso nao encontre nenhum registro
      toughtsQty = false;
    }
    const toughts = toughtsData.map((result) => result.get({ plain: true })); // tem que fazer isso, para pegar os dados do usuario tambem, com o raw:true nao funciona

    res.render("toughts/home", { toughts, search, toughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;
    const user = await User.findOne({
      where: {
        id: userId,
      },
      include: Tought,
      plain: true, // aqui tras somente os dados que importam do arrai do toughts, da tabela, se nao tras um monte de coisas junto que nao interessa, acho que funciona igual o raw:true
    });
    if (!user) {
      res.redirect("/login");
    }
    const toughts = user.Toughts.map((result) => result.dataValues); // aqui limpa os dados deixzando os lixos para tras, e um complemanto do plain:true acima
    let emptyToughts = false;
    if (toughts.length === 0) {
      emptyToughts = true;
    }
    const numToughts = toughts.length;

    //const toughts = await Tought.findAll({where:{UserId:userId},raw:true}) // posso fazer assim tambem ao inves de colocar o include:Tought, o plain: true e a linha da constante const toughts = user.Toughts.map((result)=> result.dataValues). fazendo dessa forma acho que fica mais facil de fazer e de gravar
    res.render("toughts/dashboard", { toughts, emptyToughts, numToughts });
  }

  static async createToughtsSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento salvo com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;
    try {
      await Tought.destroy({ where: { id: id, UserId: userId } });

      req.flash("message", "Pensamento removido com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
  static async edit(req, res) {
    const id = req.params.id;
    const tought = await Tought.findOne({ raw: true, where: { id: id } });
    res.render("toughts/edit", { tought });
  }
  static async editSave(req, res) {
    const id = req.body.id;
    const title = req.body.title;

    try {
      await Tought.update({ title }, { where: { id: id } });
      req.flash("message", "Pensamento atualizado com sucesso");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  }
  static createToughts(req, res) {
    res.render("toughts/create");
  }
};
