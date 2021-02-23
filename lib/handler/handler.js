const AmoCRM = require("amocrm-js"),
  config = require("../config.json"),
  crm = new AmoCRM(config.amocrm),
  moment = require("moment"),
  statuses = require("../statuses.json");

module.exports.leads = async (req, res) => {
  let _leads = await crm.request.get("/api/v4/leads?with=contacts&");
  let leads = _leads.data._embedded.leads;

  let _contacts = await crm.request.get("/api/v4/contacts?with=leads");
  let contacts = _contacts.data._embedded.contacts;

  let _responsible = await crm.request.get("/api/v4/users");
  let responsible = _responsible.data._embedded.users;

  let info = [];
  let contactInfo = [];
  let result = [];
  let a = [];
  let users = [];
  let final;

  for (let key in leads) {
    leads[key]._embedded.contacts.map((item) => {
      for (let key in contacts) {
        if (item.id == contacts[key].id) {
          for (let j in contacts[key].custom_fields_values) {
            let contact = contacts[key].custom_fields_values[j].field_code;
            let contactValue =
              contacts[key].custom_fields_values[j].values[0].value;
            contactInfo.push({
              id: contacts[key].id,
              name: contacts[key].name,
              info: {
                contact,
                contactValue,
              },
            });
          }
        }
      }
    });
  }

  contactInfo.forEach(function (a) {
    if (!this[a.name]) {
      this[a.name] = { id: a.id, name: a.name, tags: a.tags, info: [] };
      result.push(this[a.name]);
    }
    this[a.name].info.push(a.info);
  }, Object.create(null));

  let day, date;

  for (let key in leads) {
    a.push(leads[key]._embedded.contacts);

    day = moment.unix(leads[key].created_at).locale("ru");
    date = day.format("DD MMMM YYYY");
    for (let other in a[key]) {
      delete a[key][other].is_main;
      delete a[key][other]._links;
      for (let checker in result) {
        if (a[key][other].id == result[checker].id) {
          delete a[key][other].id;
          a[key][other] = result[checker];
        }
      }
    }

    for (let user in responsible) {
      if (responsible[user].id == leads[key].responsible_user_id) {
        users.push(responsible[user].name);
      }
    }

    let obj = {
      id: leads[key].id,
      name: leads[key].name,
      responsible: users[key],
      status: statuses[leads[key].status_id],
      created: date,
      budget: leads[key].price,
      tags: leads[key]._embedded.tags,
      contacts: a[key],
    };
    info.push(obj);
  }
  final = info.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i);

  res.json(final);
};
