<?php
/*
 * Save incoming data from javascript experiments to a .csv file
 * Expects json input with fields:
 * user_id {string} alphanumeric user id
 * [experiment] {string} alphanumeric experiment string (not needed if user_id == "test_id")
 * [version] {number[]} version numbering (not needed if user_id == "test_id")
 * csv {string} file contents in .csv format
 *
 * Returns a HTTP response with 200 on success and body text saying so.
 * On error returns HTTP response != 200 and exception details in the body.
 */

$post_data = json_decode(file_get_contents('php://input'), true);
try {
    // the directory "data" must be writable by the server
    $name = $post_data['user_id'];
    if(!preg_match('/[a-zA-Z0-9]+/', $name))
        throw new Exception('Invalid user ID');
    if($name == "test_id") {
        $name = "data/public/$name.csv";
        $data = "";
    } else {
        $experiment_name = $post_data['experiment'];
        // Version should be a numeric array (preferably major, minor, release)
        $experiment_version = $post_data['version'];
        if(!preg_match('/[a-zA-Z0-9]+/', $experiment_name))
            throw new Exception('Invalid experiment name');
        if (count($experiment_version) != count(array_filter($experiment_version, 'is_numeric'))) {
            throw new Exception(('Invalid experiment version'));
        }
        $name = "data/public/" . $experiment_name . "_v" . join('.', $experiment_version) . "_$name.csv";
        $data = $post_data['csv'];
    }
    // write the file to disk
    file_put_contents($name, $data);
    http_response_code(200);
    die('Data saved successfully');
} catch(Exception $exception) {
    http_response_code(400);
    die($exception);
}
