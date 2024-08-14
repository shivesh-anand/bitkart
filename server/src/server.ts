import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import app from "./app.js";

const numCPUs = availableParallelism();
const PORT = process.env.PORT || 5000;

if (cluster.isPrimary) {
  console.log(`Master process is running with PID: ${process.pid}`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} is running on port ${PORT}`);
  });
}
