export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 100],
    'subject-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Documentación
        'style', // Formato sin cambio de lógica
        'refactor', // Refactor sin cambio de funcionalidad ni fix
        'perf', // Mejora de rendimiento
        'test', // Tests
        'build', // Cambios en build o dependencias
        'ci', // Cambios en CI
        'chore', // Tareas de mantenimiento
        'revert', // Revert de un commit anterior
      ],
    ],
  },
};
