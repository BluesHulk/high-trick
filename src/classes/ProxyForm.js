export default class ProxyForm {
  constructor(
    formOption = {
      action: '',
      method: 'post',
      enctype: 'application/x-www-form-urlencoded',
      target: '_blank',
      name: ''
    },
    inputs = []
  ) {
    this.form = null;
    this.formOption = formOption;
    this.inputs = inputs;
  }

  getForm() {
    const form = this.createForm();
    for (let i = 0; i < this.inputs.length; i++) {
      const opt = this.inputs[i];
      form.appendChild(this.createInput(opt));
    }
    this.form = form;
    return this;
  }

  submit() {
    document.body.appendChild(this.form);
    this.form.submit();
    document.body.removeChild(this.form);
  }

  createInput(inputOption /* id, name, value, type */) {
    const input = document.createElement('input');
    for (const p in inputOption) {
      input[p] = inputOption[p];
    }
    return input;
  }

  createForm() {
    const form = document.createElement('form');
    for (const p in this.formOption) {
      form[p] = this.formOption[p];
    }
    return form;
  }
}
