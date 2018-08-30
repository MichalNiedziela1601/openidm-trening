/*
 * Copyright 2015-2017 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package org.forgerock.openicf.connectors.hrdb

import groovy.sql.Sql
import org.forgerock.openicf.connectors.hrdb.HRDBConfiguration
import org.forgerock.openicf.misc.scriptedcommon.OperationType
import org.identityconnectors.common.logging.Log

import java.sql.Connection

/**
 * Built-in accessible objects
 **/

// OperationType is TEST for this script
def operation = operation as OperationType

// The configuration class created specifically for this connector
def configuration = configuration as HRDBConfiguration

// Default logging facility
def log = log as Log

/**
 * Script action - Customizable
 *
 * The purpose of Test is to test the connection to the external source to ensure the
 * other actions can succeed.
 *
 * Throw an exception if the test fails
 **/

/* Log something to demonstrate this script executed */
log.info("Test script executed");

def connection = new Sql(connection as Connection)

// if the database connection isn't properly established this query will result in an error.
// Errors thrown here will prevent the connector from being enabled.
connection.execute("show databases");

