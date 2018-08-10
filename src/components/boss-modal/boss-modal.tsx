import { Component } from '@stencil/core';

@Component({
  tag: 'boss-modal',
  // styleUrl: 'my-component.css',
  shadow: false
})
export class BossModal {

  // @Prop() first: string;
  // @Prop() last: string;

  // render() {
  //   return (
  //     <div>
  //       Hello, World! I'm {this.first} {this.last}
  //     </div>
  //   );
  // }

  render() {
    return ( <slot /> );
  }

}