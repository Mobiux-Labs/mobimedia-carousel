import { LitElement, html, css } from 'lit';

class HelloWorld extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      font-family: Arial, sans-serif;
      color: #333;
    }
    h1 {
      color: #007acc;
    }
  `;

  render() {
    return html`<h1>Hello, World!</h1>`;
  }
}

customElements.define('hello-world', HelloWorld);
