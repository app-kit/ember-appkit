import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('app-form-ckeditor', 'Integration | Component | app form ckeditor', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{app-form-ckeditor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#app-form-ckeditor}}
      template block text
    {{/app-form-ckeditor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
