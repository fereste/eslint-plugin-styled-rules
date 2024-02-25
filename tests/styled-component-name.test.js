const { RuleTester } = require('eslint');
const styledComponentNameRule = require('../rules/styled-component-name');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2015,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    }
});

ruleTester.run('styled-component-name', styledComponentNameRule, {
    valid: [
        { code: 'const BoxStyled = styled(Box)(() => ({}));' },
        { code: 'const BoxStyled = styled(Box)(() => ({ style: 1 }));' },
        { code: 'const BoxStyled = styled(Box)(() => ({})), other = 44;' },
        { code: 'const BoxStyled = styled(Box)(() => ({})), Boxother = styled(Box)(() => ({}));' },
        { code: 'const DivStyled = styled("div")(() => ({}));' },
        { code: 'const BoxStyled = styled((props) => <Box component="span" />)(() => ({}));' },
        { code: 'const someRandomVariable = myFunction(Box);' },
    ],
    invalid: [
        {
            code: 'const MyComponent = styled(Box)(() => ({}));',
            errors: [{ messageId: 'wrongName' }],
            output: 'const BoxMyComponent = styled(Box)(() => ({}));',
        },
        {
            code: 'const MyComponent = styled("div")(() => ({}));',
            errors: [{ messageId: 'wrongName' }],
            output: 'const DivMyComponent = styled("div")(() => ({}));',
        },
        {
            code: 'const MyComponent = styled("a")(() => ({}));',
            errors: [{ messageId: 'wrongName' }],
            output: 'const AMyComponent = styled("a")(() => ({}));',
        },
        {
            code: 'const divMyComponent = styled("div")(() => ({}));',
            errors: [{ messageId: 'wrongName' }],
            output: 'const DivdivMyComponent = styled("div")(() => ({}));',
        },
    ],
});