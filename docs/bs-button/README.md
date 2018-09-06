# Buttons

## Toggle a buttons active class

Add `data-toggle="button"` to toggle a button’s active state. If you’re pre-toggling a button, you must manually add the `.active` class and `aria-pressed="true"` to the `<bs-button>`.

<vue-html-wrapper>
  <template slot="example">
    <bs-button v-pre role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
      Single toggle
    </bs-button>
  </template>
</vue-html-wrapper>

```html
<bs-button role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
  Single toggle
</bs-button>
```

## Checkbox and radio buttons

<vue-html-wrapper><template slot="example">
  <div class="btn-group-toggle" data-toggle="buttons">
    <bs-button v-pre class="btn btn-secondary active">
      <input type="checkbox" checked autocomplete="off"> Checked
    </bs-button>
  </div>
</template></vue-html-wrapper>

```html
<div class="btn-group-toggle" data-toggle="buttons">
  <bs-button v-pre class="btn btn-secondary active">
    <input type="checkbox" checked autocomplete="off"> Checked
  </bs-button>
</div>
```

<vue-html-wrapper><template slot="example">
  <div class="btn-group btn-group-toggle" data-toggle="buttons">
    <bs-button v-pre class="btn btn-secondary active">
      <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
    </bs-button>
    <bs-button v-pre class="btn btn-secondary">
      <input type="radio" name="options" id="option2" autocomplete="off"> Radio
    </bs-button>
    <bs-button v-pre class="btn btn-secondary">
      <input type="radio" name="options" id="option3" autocomplete="off"> Radio
    </bs-button>
  </div>
</template></vue-html-wrapper>

```html
<div class="btn-group btn-group-toggle" data-toggle="buttons">
  <bs-button class="btn btn-secondary active">
    <input type="radio" name="options" id="option1" autocomplete="off" checked> Active
  </bs-button>
  <bs-button class="btn btn-secondary">
    <input type="radio" name="options" id="option2" autocomplete="off"> Radio
  </bs-button>
  <bs-button class="btn btn-secondary">
    <input type="radio" name="options" id="option3" autocomplete="off"> Radio
  </bs-button>
</div>
```

## Wrapped Buttons
You may want to use an anchor tag as a bs-button.  This can be done using a wrapped button.  Note: Make sure you set `tabindex="-1"` on the bs-button wrapper or else tabbing and focus will not work correctly.

<vue-html-wrapper>
  <template slot="example">
    <bs-button v-pre tabindex="-1">
      <a href="#" role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
        toggle anchor
      </a>
    </bs-button>
  </template>
</vue-html-wrapper>

```html
<bs-button tabindex="-1">
  <a href="#" role="button" class="btn btn-primary" data-toggle="button" aria-pressed="false" autocomplete="off">
    toggle anchor
  </a>
</bs-button>
```

## Without bs-components
Without the bs-button component the bootstrap buttons and anchor tags will work as normal html elements.  Note that an anchor tag will not be prevented from submitting unless it is wrapped in a bs-button tag.

```html
<a class="btn btn-primary" href="#" role="button">Link</a>
<button class="btn btn-primary" type="submit">Button</button>
<input class="btn btn-primary" type="button" value="Input">
<input class="btn btn-primary" type="submit" value="Submit">
<input class="btn btn-primary" type="reset" value="Reset">
```

## Triggers
The other components such as collapses and modals use bs-button components to trigger them.  See those scetions for details on that.

## Methods
bs-button only has one method.

| Method  | Description  |
| ------------- | ------------- |
| .button('toggle'); | Toggles push state. Gives the button the appearance that it has been activated. |

```js
document.querySelector('#my-button').button('toggle');
```
