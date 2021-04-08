import firebase, { userRef } from './firebase';

export const authMethods = {
	signIn: async () => {
		try {
			const provider = new firebase.auth.GoogleAuthProvider();

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
							if (snapshot.exists) {
								console.log(snapshot);
							} else {
								userRef.doc(uid).set({ name: displayName, avatar: photoURL });
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
