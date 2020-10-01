module.exports = function (plop) {
  plop.setGenerator('component', {
    description: 'Generate a new react component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a component name (e.g. MyComponent or MyPage):',
      },
    ],
    actions(data) {
      const dir = /page$/i.test(data.name)
        ? 'src/components/pages/{{name}}'
        : 'src/components/{{name}}';

      const name = '{{pascalCase name}}';

      return [
        {
          // Add the new component
          type: 'add',
          path: `${dir}/index.tsx`,
          templateFile: 'plop-templates/Component.tsx.hbs',
        },
        {
          // Add the new component's styles
          type: 'add',
          path: `${dir}/${name}.module.scss`,
          templateFile: 'plop-templates/Component.module.scss.hbs',
        },
        {
          type: 'add',
          path: `${dir}/${name}.stories.tsx`,
          templateFile: 'plop-templates/Component.stories.tsx.hbs',
        },
      ];
    },
  });

  plop.setGenerator('redux', {
    description: 'Generate a new redux action/reducer/selector',
    prompts: [
      {
        type: 'input',
        name: 'stateName',
        message: 'Enter the new key to add to the redux state (e.g. comments):',
      },
      {
        type: 'input',
        name: 'actionName',
        message: 'Enter an action to add (e.g. postComment):',
      },
    ],
    actions: [
      {
        // Add the new action
        type: 'add',
        path: 'src/redux/actions/{{camelCase stateName}}.ts',
        templateFile: 'plop-templates/action.ts.hbs',
      },
      {
        // Add the new reducer
        type: 'add',
        path: 'src/redux/reducers/{{camelCase stateName}}.ts',
        templateFile: 'plop-templates/reducer.ts.hbs',
      },
      {
        // Add the new reducer's tests
        type: 'add',
        path: 'src/redux/reducers/{{camelCase stateName}}.test.ts',
        templateFile: 'plop-templates/reducer.test.ts.hbs',
      },
      {
        // Add the new selector
        type: 'add',
        path: 'src/redux/selectors/{{camelCase stateName}}.ts',
        templateFile: 'plop-templates/selector.ts.hbs',
      },
      {
        // Add the new selector's tests
        type: 'add',
        path: 'src/redux/selectors/{{camelCase stateName}}.test.ts',
        templateFile: 'plop-templates/selector.test.ts.hbs',
      },
      {
        // Combine the new reducer with existing reducers
        type: 'modify',
        path: 'src/redux/reducers/index.ts',
        pattern: /([^])\n\n(const reducers = {[^]+)(\n};)/,
        template: [
          '$1',
          "import {{camelCase stateName}} from 'src/redux/reducers/{{camelCase stateName}}';\n",
          '$2',
          '  {{camelCase stateName}},',
          '};',
        ].join('\n'),
      },
    ],
  });
};
