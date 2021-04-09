import firebase, { userRef } from './firebase';

export const authMethods = {
	signIn: async () => {
		try {
			const provider = new firebase.auth.GoogleAuthProvider();
			provider.addScope('profile');

			await firebase
				.auth()
				.signInWithPopup(provider)
				.then(result => {
					const {
						user: { uid, displayName, photoURL },
					} = result;

					userRef
						.doc(uid)
						.get()
						.then(snapshot => {
							if (!snapshot.exists) {
								userRef.doc(uid).set({
									name: displayName,
									avatar: photoURL,
									createdAt: firebase.firestore.FieldValue.serverTimestamp(),
								});
							}
						});
				})
				.catch(error => {
					console.error(error);
				});
		} catch (error) {
			console.error(error);
		}
	},
	signOut: async cb => {
		try {
			await firebase
				.auth()
				.signOut()
				.then(() => {
					if (typeof cb === 'function') cb();
				})
				.catch(error => {
					console.error(error);
				});
		} catch (error) {
			console.error(error);
			if (typeof cb === 'function') cb();
		}
	},
};
