module.exports = {
    meta: {
        type: 'problem',
        hasSuggestions: true,
        fixable: true,
        messages: {
            'wrongName': 'Variable name has to start with the name of the component that is being styled.',
        },
        parserOptions: {

        }
    },

    create(context) {
        return ({
            // Use https://astexplorer.net/ to figure out the names of the nodes.
            VariableDeclaration: (node) => {
                // Only consider nodes that start with 'const'.
                if (node.kind !== 'const') {
                    return null;
                }

                // For each variable declarator
                node.declarations.forEach((variableDeclarator) => {
                    if (variableDeclarator.init.type !== "CallExpression") {
                        return;
                    }

                    const rightSide = variableDeclarator.init.callee;

                    if (rightSide.callee?.name === "styled" && rightSide.arguments[0] !== undefined) {
                        const firstArgument = rightSide.arguments[0];

                        let argumentValue;
                        switch (firstArgument.type) {
                            case 'Identifier':
                                argumentValue = firstArgument.name;
                                break;
                            case 'Literal':
                                argumentValue = firstArgument.value;
                                break;
                            default:
                                return;
                        }

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
        });
    }
};
