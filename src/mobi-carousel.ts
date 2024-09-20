import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('mobi-carousel')
export class MobiCarousel extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  override render() {
    return html`
      <div class="carousel">
        <div class="carousel-item carousel-item-visible">
          <img
            src="https://images.unsplash.com/photo-1537211261771-e525b9e4049b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=450&q=80"
            alt="Squirrel zombie"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1503925802536-c9451dcd87b5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=450&q=80"
            alt="Zombie hands"
          />
        </div>
        <div class="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1509558567730-6c838437b06b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450&q=80"
            alt="Zombie pumpkin"
          />
        </div>
        <div class="carousel-actions">
          <button id="carousel-button-prev" aria-label="Previous"><</button>
          <button id="carousel-button-next" aria-label="Next">></button>
        </div>
        <div class="carousel-dots">
          <input class="dot selected-dot" type="radio" name="dot" checked />
          <input class="dot" type="radio" name="dot" />
          <input class="dot" type="radio" name="dot" />
        </div>
      </div>
    `;
  }

  // private _onClick() {
  //   this.count++;
  //   this.dispatchEvent(new CustomEvent('count-changed'));
  // }

  /**
   * Formats a greeting
   * @param name The name to say "Hello" to
   */
  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mobi-carousel': MobiCarousel;
  }
}
