import { pool } from "../db/db.js";

export const getUser = (req, res) => {
	const id = req.params.id;
	const query = `
		SELECT u.id, u.nombre, n.nivel
		FROM usuarios u
		JOIN niveles_completados n ON u.id = n.usuario_id
		WHERE u.id = ?
		ORDER BY u.id;
	`;

	pool.execute(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ msg: error, userLevels: [] });
			return;
		}
		res.status(200).json({ userLevels: results });
	});
};


export const putNivel = (req, res) => {
	const id = req.params.id;
	const { nivel } = req.body;

	const query = `
		UPDATE niveles_completados
		SET nivel = ?
		WHERE usuario_id = ?
	`;

	pool.execute(query, [nivel, id], (error, results) => {
		if (error) {
			res.status(500).json({ msg: error });
			return;
		}
		res.status(200).json({ msg: "Nivel actualizado correctamente" });
	});
};

// implementación anterior

// export const getUser = (req, res) => {
// 	const id = req.params.id;
// 	pool.execute(" SELECT * FROM usuarios where id = ?", [id], (error, results) => {
// 		if (error) {
// 			res.status(500).json({msg: error, users: [] });
// 			return;
// 		}
// 		res.status(200).json(results[0]);
// 	});
// };