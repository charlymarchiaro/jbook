import express from 'express';
import fs from 'fs/promises';
import path from 'path';


interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

interface LocalApiError {
  code: string;
}

export const createCellsRouter = (filename: string, dir: string) => {

  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);


  router.get('/cells', async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === "string";
    };

    try {
      // Read the file and send
      const result = await fs.readFile(fullPath, {encoding: 'utf-8'});
      res.send(JSON.parse(result));

    } catch (err) {
      // If read throws an error
      if (isLocalApiError(err)) {
        // Inspect the error, see if it says that the file doesn't exist
        if (err.code === "ENOENT") {
          // Create file with default cells
          await fs.writeFile(fullPath, "[]", "utf-8");
          res.send({cells: []});
        }
      } else {
        throw err;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Take the list of cells from the request obj
    const {cells}: { cells: Cell[] } = req.body;

    // Serialize the cells and write them into the file
    await fs.writeFile(fullPath, JSON.stringify({cells}), {encoding: 'utf-8'});

    res.send({status: 'ok'});
  });

  return router;
};
