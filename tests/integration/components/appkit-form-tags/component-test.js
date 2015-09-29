import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('appkit-form-tags', 'Integration | Component | appkit form tags', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{appkit-form-tags}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#appkit-form-tags}}
      template block text
    {{/appkit-form-tags}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
