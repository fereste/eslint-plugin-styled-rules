module.exports = {
    meta: {
        type: 'problem',
        hasSuggestions: true,
        fixable: true,
        messages: {
            'wrongName': 'El nombre de la variable tiene que empezar con el nombre del componente que se está estilando.',
        },
    },
    create: (context) => ({
        VariableDeclaration: (node) => {
            if (node.kind !== 'const') {
                return null;
            }

            node.declarations.forEach(variableDeclarator => {
                if (variableDeclarator.init.type !== "CallExpression") {
                    return;
                }

                const rightSide = variableDeclarator.init.callee;

                if (rightSide.callee?.name === "styled" && rightSide.arguments[0] !== undefined) {
                    const firstArgument = rightSide.arguments[0];
                    const argumentValue = firstArgument.type === "Identifier" ? firstArgument.name : firstArgument.value;
                    const titledValue = argumentValue[0].toUpperCase() + argumentValue.substring(1);
                    const leftSide = variableDeclarator.id;

                    if (!leftSide.name.startsWith(titledValue)) {
                        context.report({
                            node: leftSide,
                            messageId: 'wrongName',
                            fix: (fixer) => fixer.insertTextBefore(leftSide, titledValue),
                        });
                    }
                }
            });
        },
    }),
};
