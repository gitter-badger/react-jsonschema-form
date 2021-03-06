import { expect } from "chai";
import { Simulate } from "react-addons-test-utils";

import { parseDateString, toDateString } from "../src/utils";
import { createFormComponent, createSandbox } from "./test_utils";


describe("StringField", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("TextWidget", () => {
    it("should render a string field", () => {
      const {node} = createFormComponent({schema: {
        type: "string"
      }});

      expect(node.querySelectorAll(".field input[type=text]"))
        .to.have.length.of(1);
    });

    it("should render a string field with a label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        title: "foo"
      }});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should render a string field with a placeholder", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        description: "bar",
      }});

      expect(node.querySelector(".field input").getAttribute("placeholder"))
        .eql("bar");
    });

    it("should assign a default value", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        default: "plop",
      }});

      expect(node.querySelector(".field input").value)
        .eql("plop");
    });

    it("should default state value to undefined", () => {
      const {comp} = createFormComponent({schema: {type: "string"}});

      expect(comp.state.formData).eql(undefined);
    });

    it("should handle a change event", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
      }});

      Simulate.change(node.querySelector("input"), {
        target: {value: "yo"}
      });

      expect(comp.state.formData).eql("yo");
    });

    it("should fill field with data", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
      }, formData: "plip"});

      expect(node.querySelector(".field input").value)
        .eql("plip");
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
      }});

      expect(node.querySelector("input[type=text]").id)
        .eql("root");
    });
  });

  describe("SelectWidget", () => {
    it("should render a string field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"]
      }});

      expect(node.querySelectorAll(".field select"))
        .to.have.length.of(1);
    });

    it("should render a string field with a label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
        title: "foo",
      }});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should render a select field with a tooltip", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
        description: "baz",
      }});

      expect(node.querySelector(".field select").getAttribute("title"))
        .eql("baz");
    });

    it("should assign a default value", () => {
      const {comp} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
        default: "bar",
      }});

      expect(comp.state.formData).eql("bar");
    });

    it("should reflect the change into the form state", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
      }});

      Simulate.change(node.querySelector("select"), {
        target: {value: "foo"}
      });

      expect(comp.state.formData).eql("foo");
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
      }});

      Simulate.change(node.querySelector("select"), {
        target: {value: "foo"}
      });

      expect(node.querySelector("select").value).eql("foo");
    });

    it("should fill field with data", () => {
      const {comp} = createFormComponent({schema: {
        type: "string",
        enum: ["foo", "bar"],
      }, formData: "bar"});

      expect(comp.state.formData).eql("bar");
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        enum: ["a", "b"]
      }});

      expect(node.querySelector("select").id)
        .eql("root");
    });
  });

  describe("DateTimeWidget", () => {
    it("should render an datetime-local field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }});

      expect(node.querySelectorAll(".field [type=datetime-local]"))
        .to.have.length.of(1);
    });

    it("should assign a default value", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
        default: datetime,
      }});

      expect(comp.state.formData).eql(datetime);
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }});

      const newDatetime = new Date().toJSON();

      Simulate.change(node.querySelector("[type=datetime-local]"), {
        target: {value: newDatetime}
      });

      expect(node.querySelector("[type=datetime-local]").value)
        // XXX import and use conversion helper
        .eql(newDatetime.slice(0, 19));
    });

    it("should fill field with data", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, formData: datetime});

      expect(comp.state.formData).eql(datetime);
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }});

      expect(node.querySelector("[type=datetime-local]").id)
        .eql("root");
    });

    it("should reject an invalid entered datetime", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, liveValidate: true});

      Simulate.change(node.querySelector("[type=datetime-local]"), {
        target: {value: "invalid"}
      });

      expect(comp.state.errors).to.have.length.of(1);
    });
  });

  describe("DateWidget", () => {
    const uiSchema = {"ui:widget": "date"};

    it("should render a date field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      expect(node.querySelectorAll(".field [type=date]"))
        .to.have.length.of(1);
    });

    it("should assign a default value", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date",
        default: datetime,
      }, uiSchema});

      expect(comp.state.formData).eql(datetime);
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      const newDatetime = "2012-12-12";

      Simulate.change(node.querySelector("[type=date]"), {
        target: {value: newDatetime}
      });

      expect(node.querySelector("[type=date]").value)
        // XXX import and use conversion helper
        .eql(newDatetime.slice(0, 10));
    });

    it("should fill field with data", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, formData: datetime});

      expect(comp.state.formData).eql(datetime);
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      expect(node.querySelector("[type=date]").id)
        .eql("root");
    });

    it("should accept a valid entered date", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema, liveValidate: true});

      Simulate.change(node.querySelector("[type=date]"), {
        target: {value: "2012-12-12"}
      });

      expect(comp.state.errors).to.have.length.of(0);
      expect(comp.state.formData).eql("2012-12-12");
    });

    it("should reject an invalid entered date", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema, liveValidate: true});

      Simulate.change(node.querySelector("[type=date]"), {
        target: {value: "invalid"}
      });

      expect(comp.state.errors).to.have.length.of(1);
    });
  });

  describe("AltDateTimeWidget", () => {
    const uiSchema = {"ui:widget": "alt-datetime"};

    it("should render a datetime field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, uiSchema});

      expect(node.querySelectorAll(".field select"))
        .to.have.length.of(6);
    });

    it("should render a string field with a main label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
        title: "foo",
      }, uiSchema});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should assign a default value", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
        default: datetime,
      }, uiSchema});

      expect(comp.state.formData).eql(datetime);
    });

    it("should reflect the change into the dom", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, uiSchema});

      Simulate.change(node.querySelector("#root_year"), {target: {value: 2012}});
      Simulate.change(node.querySelector("#root_month"), {target: {value: 10}});
      Simulate.change(node.querySelector("#root_day"), {target: {value: 2}});
      Simulate.change(node.querySelector("#root_hour"), {target: {value: 1}});
      Simulate.change(node.querySelector("#root_minute"), {target: {value: 2}});
      Simulate.change(node.querySelector("#root_second"), {target: {value: 3}});

      expect(comp.state.formData).eql("2012-10-02T01:02:03.000Z");
    });

    it("should fill field with data", () => {
      const datetime = new Date().toJSON();
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, formData: datetime});

      expect(comp.state.formData).eql(datetime);
    });

    it("should render the widgets with the expected ids", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, uiSchema});

      const ids = [].map.call(node.querySelectorAll("select"), node => node.id);

      expect(ids).eql([
        "root_year",
        "root_month",
        "root_day",
        "root_hour",
        "root_minute",
        "root_second",
      ]);
    });

    it("should render the widgets with the expected options' values", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, uiSchema});

      const lengths = [].map.call(node.querySelectorAll("select"),
                                  node => node.length);

      expect(lengths).eql([
        121 + 1, // from 1900 to 2020 + undefined
        12 + 1,
        31 + 1,
        24 + 1,
        60 + 1,
        60 + 1
      ]);
      const monthOptions = node.querySelectorAll("select#root_month option");
      const monthOptionsValues = [].map.call(monthOptions, o => o.value);
      expect(monthOptionsValues).eql([
        "-1", "1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12"]);
    });

    it("should render the widgets with the expected options' labels", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date-time",
      }, uiSchema});

      const monthOptions = node.querySelectorAll("select#root_month option");
      const monthOptionsLabels = [].map.call(monthOptions, o => o.text);
      expect(monthOptionsLabels).eql([
        "month", "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"]);
    });

    describe("Action buttons", () => {
      it("should render action buttons", () => {
        const {node} = createFormComponent({schema: {
          type: "string",
          format: "date-time",
        }, uiSchema});

        const buttonLabels = [].map.call(node.querySelectorAll("a.btn"),
                                         x => x.textContent);
        expect(buttonLabels).eql(["Now", "Clear"]);
      });

      it("should set current date when pressing the Now button", () => {
        const {comp, node} = createFormComponent({schema: {
          type: "string",
          format: "date-time",
        }, uiSchema});

        Simulate.click(node.querySelector("a.btn-now"));

        // Test that the two DATETIMEs are within 5 seconds of each other.
        const now = new Date().getTime();
        const timeDiff = now - new Date(comp.state.formData).getTime();
        expect(timeDiff).to.be.at.most(5000);
      });

      it("should clear current date when pressing the Clear button", () => {
        const {comp, node} = createFormComponent({schema: {
          type: "string",
          format: "date-time",
        }, uiSchema});

        Simulate.click(node.querySelector("a.btn-now"));
        Simulate.click(node.querySelector("a.btn-clear"));

        expect(comp.state.formData).eql(undefined);
      });
    });
  });

  describe("AltDateWidget", () => {
    const uiSchema = {"ui:widget": "alt-date"};

    it("should render a date field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      expect(node.querySelectorAll(".field select"))
        .to.have.length.of(3);
    });

    it("should render a string field with a main label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
        title: "foo",
      }, uiSchema});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should assign a default value", () => {
      const datetime = "2012-12-12";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date",
        default: datetime,
      }, uiSchema});

      expect(comp.state.formData).eql(datetime);
    });

    it("should reflect the change into the dom", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      Simulate.change(node.querySelector("#root_year"), {target: {value: 2012}});
      Simulate.change(node.querySelector("#root_month"), {target: {value: 10}});
      Simulate.change(node.querySelector("#root_day"), {target: {value: 2}});

      expect(comp.state.formData).eql("2012-10-02");
    });

    it("should fill field with data", () => {
      const datetime = "2012-12-12";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema, formData: datetime});

      expect(comp.state.formData).eql(datetime);
    });

    it("should render the widgets with the expected ids", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      const ids = [].map.call(node.querySelectorAll("select"), node => node.id);

      expect(ids).eql([
        "root_year",
        "root_month",
        "root_day",
      ]);
    });

    it("should render the widgets with the expected options' values", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      const lengths = [].map.call(node.querySelectorAll("select"),
                                  node => node.length);

      expect(lengths).eql([
        121 + 1, // from 1900 to 2020 + undefined
        12 + 1,
        31 + 1,
      ]);
      const monthOptions = node.querySelectorAll("select#root_month option");
      const monthOptionsValues = [].map.call(monthOptions, o => o.value);
      expect(monthOptionsValues).eql([
        "-1", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]);
    });

    it("should render the widgets with the expected options' labels", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema});

      const monthOptions = node.querySelectorAll("select#root_month option");
      const monthOptionsLabels = [].map.call(monthOptions, o => o.text);
      expect(monthOptionsLabels).eql([
        "month", "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12"]);
    });

    it("should accept a valid date", () => {
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "date",
      }, uiSchema, liveValidate: true});

      comp.componentWillReceiveProps({formData: "2012-12-12"});

      expect(comp.state.errors).to.have.length.of(0);
    });

    describe("Action buttons", () => {
      it("should render action buttons", () => {
        const {node} = createFormComponent({schema: {
          type: "string",
          format: "date",
        }, uiSchema});

        const buttonLabels = [].map.call(node.querySelectorAll("a.btn"),
                                         x => x.textContent);
        expect(buttonLabels).eql(["Now", "Clear"]);
      });

      it("should set current date when pressing the Now button", () => {
        const {comp, node} = createFormComponent({schema: {
          type: "string",
          format: "date",
        }, uiSchema});

        Simulate.click(node.querySelector("a.btn-now"));

        const expected = toDateString(parseDateString(new Date().toJSON()), false);
        expect(comp.state.formData).eql(expected);
      });

      it("should clear current date when pressing the Clear button", () => {
        const {comp, node} = createFormComponent({schema: {
          type: "string",
          format: "date",
        }, uiSchema});

        Simulate.click(node.querySelector("a.btn-now"));
        Simulate.click(node.querySelector("a.btn-clear"));

        expect(comp.state.formData).eql(undefined);
      });
    });
  });

  describe("EmailWidget", () => {
    it("should render an email field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "email",
      }});

      expect(node.querySelectorAll(".field [type=email]"))
        .to.have.length.of(1);
    });

    it("should render a string field with a label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "email",
        title: "foo",
      }});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should render a select field with a placeholder", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "email",
        description: "baz",
      }});

      expect(node.querySelector(".field [type=email]").getAttribute("placeholder"))
        .eql("baz");
    });

    it("should assign a default value", () => {
      const email = "foo@bar.baz";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "email",
        default: email,
      }});

      expect(comp.state.formData).eql(email);
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "email",
      }});

      const newDatetime = new Date().toJSON();

      Simulate.change(node.querySelector("[type=email]"), {
        target: {value: newDatetime}
      });

      expect(node.querySelector("[type=email]").value)
        .eql(newDatetime);
    });

    it("should fill field with data", () => {
      const email = "foo@bar.baz";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "email",
      }, formData: email});

      expect(comp.state.formData).eql(email);
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "email",
      }});

      expect(node.querySelector("[type=email]").id)
        .eql("root");
    });

    it("should reject an invalid entered email", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "email",
      }, liveValidate: true});

      Simulate.change(node.querySelector("[type=email]"), {
        target: {value: "invalid"}
      });

      expect(comp.state.errors).to.have.length.of(1);
    });
  });

  describe("URLWidget", () => {
    it("should render an url field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
      }});

      expect(node.querySelectorAll(".field [type=url]"))
        .to.have.length.of(1);
    });

    it("should render a string field with a label", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
        title: "foo",
      }});

      expect(node.querySelector(".field label").textContent)
        .eql("foo");
    });

    it("should render a select field with a placeholder", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
        description: "baz",
      }});

      expect(node.querySelector(".field [type=url]").getAttribute("placeholder"))
        .eql("baz");
    });

    it("should assign a default value", () => {
      const url = "http://foo.bar/baz";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "uri",
        default: url,
      }});

      expect(comp.state.formData).eql(url);
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
      }});

      const newDatetime = new Date().toJSON();
      Simulate.change(node.querySelector("[type=url]"), {
        target: {value: newDatetime}
      });

      expect(node.querySelector("[type=url]").value).eql(newDatetime);
    });

    it("should fill field with data", () => {
      const url = "http://foo.bar/baz";
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "uri",
      }, formData: url});

      expect(comp.state.formData).eql(url);
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
      }});

      expect(node.querySelector("[type=url]").id)
        .eql("root");
    });

    it("should reject an invalid entered url", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "uri",
      }, liveValidate: true});

      Simulate.change(node.querySelector("[type=url]"), {
        target: {value: "invalid"}
      });

      expect(comp.state.errors).to.have.length.of(1);
    });
  });

  describe("ColorWidget", () => {
    const uiSchema = {"ui:widget": "color"};
    const color = "#123456";

    it("should render a color field", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "color",
      }, uiSchema});

      expect(node.querySelectorAll(".field [type=color]"))
        .to.have.length.of(1);
    });

    it("should assign a default value", () => {
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "color",
        default: color,
      }, uiSchema});

      expect(comp.state.formData).eql(color);
    });

    it("should reflect the change into the dom", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "color",
      }, uiSchema});

      const newColor = "#654321";

      Simulate.change(node.querySelector("[type=color]"), {
        target: {value: newColor}
      });

      expect(node.querySelector("[type=color]").value)
        .eql(newColor);
    });

    it("should fill field with data", () => {
      const {comp} = createFormComponent({schema: {
        type: "string",
        format: "color",
      }, formData: color});

      expect(comp.state.formData).eql(color);
    });

    it("should render the widget with the expected id", () => {
      const {node} = createFormComponent({schema: {
        type: "string",
        format: "color",
      }, uiSchema});

      expect(node.querySelector("[type=color]").id)
        .eql("root");
    });


    it("should reject an invalid entered color", () => {
      const {comp, node} = createFormComponent({schema: {
        type: "string",
        format: "color",
      }, uiSchema, liveValidate: true});

      Simulate.change(node.querySelector("[type=color]"), {
        target: {value: "invalid"}
      });

      expect(comp.state.errors).to.have.length.of(1);
    });
  });
});
