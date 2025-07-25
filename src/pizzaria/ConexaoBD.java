package pizzaria;

import java.sql.*;
 
public class ConexaoBD {
    public static Connection ligar() throws SQLException {
        return DriverManager.getConnection(
            "jdbc:mysql://localhost:3307/pizzaria", "root", "rzq7xgq8"
        );
    }
}