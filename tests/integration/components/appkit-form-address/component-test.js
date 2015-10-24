import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('appkit-form-address', 'Integration | Component | appkit form address', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{appkit-form-address}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#appkit-form-address}}
      template block text
    {{/appkit-form-address}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
