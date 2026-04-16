/** Default route for each app role (Firestore `users/{uid}.role`). */
export function pathForRole(role) {
  switch (role) {
    case 'owner':
      return '/owner'
    case 'supervisor':
      return '/supervisor'
    case 'auditor':
    case 'ca':
      return '/auditor'
    default:
      return '/'
  }
}
