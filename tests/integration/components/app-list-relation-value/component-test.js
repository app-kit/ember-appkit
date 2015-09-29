import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-list-relation-value', 'Integration | Component | app list relation value', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{app-list-relation-value}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#app-list-relation-value}}
      template block text
    {{/app-list-relation-value}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
