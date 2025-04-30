import {pool} from "../db/db.js";


export const getRegitros = (req,res) => {
    pool.query("SELECT * FROM registros", (error,results) => {
        if(error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(200).json({msg:"OK",data:results});
    });
};

export const getUsuarios = (req,res) => {
    pool.query("SELECT * FROM usuarios", (error,results) => {
        if(error) {
            res.status(500).json({message: error.message});
            return;
        }
        res.status(200).json({msg:"OK",data:results});
    });
}
