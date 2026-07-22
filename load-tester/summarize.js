const fs = require('fs');

try {
  // Read the artillery JSON report
  const data = fs.readFileSync('report.json', 'utf8');
  const report = JSON.parse(data);
  
  const aggregate = report.aggregate || {};
  const counters = aggregate.counters || {};
  const summaries = aggregate.summaries || {};

  // Extract key metrics
  const totalUsers = counters['vusers.created'] || 0;
  const completedUsers = counters['vusers.completed'] || 0;
  const failedUsers = counters['vusers.failed'] || 0;
  
  // Calculate duration if available
  const sessionLength = summaries['vusers.session_length'] || {};
  const avgResponseTime = sessionLength.mean ? Math.round(sessionLength.mean) : 0;
  
  // Print beautiful, non-techy summary
  console.log('\n======================================================');
  console.log('LOAD TEST SUMMARY');
  console.log('======================================================\n');
  
  console.log(`Total Users Simulated: ${totalUsers}`);
  console.log(`Successfully Connected & Chatted: ${completedUsers}`);
  console.log(`Failed Connections/Errors: ${failedUsers}`);
  
  if (avgResponseTime > 0) {
    console.log(`Average time a user spent: ${avgResponseTime} ms`);
  }
  
  if (totalUsers > 0 && failedUsers === 0) {
    console.log(`\n The system handled all ${totalUsers} users perfectly without breaking a sweat!`);
  } else if (failedUsers > 0) {
    console.log(`\n ${failedUsers} users failed to connect. The system might be overloaded.`);
  } else {
    console.log(`\nNo users were simulated. Did the test run properly?`);
  }

  console.log('\n======================================================\n');

  // Clean up the report.json so we don't leave junk around
  fs.unlinkSync('report.json');
} catch (error) {
  console.log('\n======================================================');
  console.log('Oops! Something went wrong while reading the test results.');
  console.log('Error details: ', error.message);
  console.log('======================================================\n');
}
