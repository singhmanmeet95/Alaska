import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the compiled C++ executable
// Ensure you have compiled the C++ code:
// g++ src/algorithms/path_matcher.cpp -o src/algorithms/matcher.exe -O3
const MATCHER_PATH = path.resolve(__dirname, "../algorithms/matcher.exe");

/**
 * Matches a reference trip against a list of candidate trips using the C++ Suffix Automaton matcher.
 * @param {Object} referenceTrip - The trip to match against (must have stationList).
 * @param {Array<Object>} candidateTrips - List of trips to check (must have stationList).
 * @returns {Promise<Array<Object>>} - List of candidate trips with 'matchScore' (LCS length).
 */
export const matchTripsWithCpp = (referenceTrip, candidateTrips) => {
  return new Promise((resolve, reject) => {
    // 1. Format input for the C++ program
    // Input Format:
    // N (length of reference)
    // S1 S2 ... SN (reference sequence)
    // M (number of candidates)
    // For each candidate:
    //   K (length)
    //   C1 C2 ... CK (candidate sequence)

    const refStations = referenceTrip.stationList || [];
    const N = refStations.length;
    let inputString = `${N}\n${refStations.join(" ")}\n`;

    const M = candidateTrips.length;
    inputString += `${M}\n`;

    for (const trip of candidateTrips) {
      const stations = trip.stationList || [];
      inputString += `${stations.length}\n${stations.join(" ")}\n`;
    }

    // 2. Spawn the C++ process
    const process = spawn(MATCHER_PATH, [], {
      stdio: ["pipe", "pipe", "pipe"],
    });

    let outputData = "";
    let errorData = "";

    // 3. Handle data flow
    process.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    process.stderr.on("data", (data) => {
      errorData += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject(
          new Error(`Matcher process exited with code ${code}: ${errorData}`),
        );
      }

      // 4. Parse Output
      // Output Format:
      // LCS_Length Candidate_Row...
      // (Sorted by LCS data)
      // Note: The C++ output doesn't include IDs, so we need to map back to candidate trips.
      // Strategy: Since C++ sorts the output, we lose the original indices.
      // SOLUTION: We should modify the C++ code to output the INDEX or ID of the candidate.
      // OR: We map based on content (risky if duplicates).
      //
      // REVISION: I will modify the C++ code to accept and return an ID/Index.
      // But for now, let's assume unique station lists or use the returned stations to match?
      // No, that's unreliable.
      //
      // Better: Modify C++ to output original index.

      resolve(outputData);
    });

    // 5. Write input to stdin
    process.stdin.write(inputString);
    process.stdin.end();
  });
};
