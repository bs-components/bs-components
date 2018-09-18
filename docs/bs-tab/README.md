# Tabs

## bs-tab Example

<vue-html-wrapper class="mt-3">
  <template slot="example">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <bs-button v-pre tabindex="-1">
          <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button v-pre tabindex="-1">
          <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button v-pre tabindex="-1">
          <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab v-pre class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </bs-tab>
      <bs-tab v-pre class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.
      </bs-tab>
      <bs-tab v-pre class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
      </bs-tab>
    </div>
  </template>
</vue-html-wrapper>

```html
    <ul class="nav nav-tabs" id="myTab" role="tablist">
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
        </bs-button>
      </li>
      <li class="nav-item">
        <bs-button tabindex="-1">
          <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
        </bs-button>
      </li>
    </ul>
    <div class="tab-content" id="myTabContent">
      <bs-tab class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</bs-tab>
      <bs-tab class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</bs-tab>
      <bs-tab class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</bs-tab>
    </div>
```

## Without bs-components

Without the bs-tab tag a tab will not open or close by itself.


## Attributes
| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| show-tab | boolean | false | when set to true the tab will toggle itself open and any other currently open tab closed |
| ignore-data-toggles | boolean | false | if set to true the tab will not toggle the add the `active` or `show` classes to the data-toggle for the currently open tab.  also the `area-selected` attribute will not be set to true |


Example js how to set an attribute true:
```js
document.querySelector('#my-tab').setAttribute('show-tab', true);
```
Example HTML with an attribute set to true.  The 3rd tab (messages) will start opened even though the 1st tab (home) has the active classes.
```html
<div class="row">
  <div class="col-3">
    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
      <bs-button tabindex="-1"><a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">Home</a></bs-button>
      <bs-button tabindex="-1"><a class="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a></bs-button>
      <bs-button tabindex="-1"><a class="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">Messages</a></bs-button>
      <bs-button tabindex="-1"><a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab" aria-controls="v-pills-settings" aria-selected="false">Settings</a></bs-button>
    </div>
  </div>
  <div class="col-9">
    <div class="tab-content" id="v-pills-tabContent">
      <bs-tab class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">tab1</bs-tab>
      <bs-tab class="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">tab2</bs-tab>
      <bs-tab show-tab class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">tab3</bs-tab>
      <bs-tab class="tab-pane fade" id="v-pills-settings" role="tabpanel" aria-labelledby="v-pills-settings-tab">tab4</bs-tab>
    </div>
  </div>
</div>
```

## Methods

### .tab('show');
will open this tab.  Note: this can be run on the `bs-button` tag that has the tab data-toggle as well as the `bs-tab`.

```js
document.querySelector('#my-tab').tab('show');
```

## Events

| Event Type | Description |
| --- | --- |
| show.bs.tab | This event fires on tab show, but before the new tab has been shown. Use `event.target` and `event.relatedTarget` to target the active tab and the previous active tab (if available) respectively. |
| shown.bs.tab | This event fires on tab show after a tab has been shown. Use `event.target` and `event.relatedTarget` to target the active tab and the previous active tab (if available) respectively. |
| hide.bs.tab | This event fires when a new tab is to be shown (and thus the previous active tab is to be hidden). Use `event.target` and `event.relatedTarget` to target the current active tab and the new soon-to-be-active tab, respectively. |
| hidden.bs.tab | This event fires after a new tab is shown (and thus the previous active tab is hidden). Use `event.target` and `event.relatedTarget` to target the previous active tab and the new active tab, respectively. |

```js
function handleTabShown(event) {
  console.log('newly activated tab: ', event.target);
  console.log('previous active tab: ', event.relatedTarget);
}
const allTabsOnThePage = document.querySelectorAll('[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]');
Array.prototype.forEach.call(allTabsOnThePage, function(el, i){
  el.addEventListener('shown.bs.tab', handleTabShown);
});
```

