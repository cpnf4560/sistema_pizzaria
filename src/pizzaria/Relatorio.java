package pizzaria;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class Relatorio {

    // 1. Clientes mais frequentes (top N)
    public static List<String> clientesMaisFrequentes(int topN) {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT c.nome, COUNT(e.id) as total " +
                "FROM clientes c " +
                "JOIN encomendas e ON c.id = e.cliente_id " +
                "GROUP BY c.id, c.nome " +
                "ORDER BY total DESC " +
                "LIMIT ?";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, topN);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                lista.add(rs.getString("nome") + " - " + rs.getInt("total") + " pedidos");
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 2. Pizzas mais vendidas (sabor + tamanho)
    public static List<String> pizzasMaisVendidas() {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT p.nome, ep.tamanho, COUNT(*) as total " +
                "FROM encomenda_pizzas ep " +
                "JOIN pizza p ON ep.pizza_id = p.id " +
                "GROUP BY ep.pizza_id, ep.tamanho " +
                "ORDER BY total DESC";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                lista.add(rs.getString("nome") + " (" + rs.getString("tamanho") + "): " + rs.getInt("total") + " vendidas");
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 3. Faturação por dia (últimos X dias)
    public static List<String> faturacaoPorDia(int dias) {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT DATE(data_hora) as dia, SUM(ep.preco) + SUM(e.taxa_entrega) as total " +
                "FROM encomendas e " +
                "JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id " +
                "WHERE data_hora >= DATE_SUB(CURDATE(), INTERVAL ? DAY) " +
                "GROUP BY dia ORDER BY dia DESC";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, dias);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                lista.add(rs.getString("dia") + ": " + String.format("%.2f", rs.getDouble("total")) + " €");
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 4. Pedidos recentes (últimos X dias)
    public static List<String> pedidosRecentes(int dias) {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT e.id, c.nome, e.data_hora FROM encomendas e " +
                "JOIN clientes c ON e.cliente_id = c.id " +
                "WHERE e.data_hora >= DATE_SUB(NOW(), INTERVAL ? DAY) " +
                "ORDER BY e.data_hora DESC";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, dias);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                lista.add("Pedido #" + rs.getInt("id") + " - " + rs.getString("nome") + " em " + rs.getTimestamp("data_hora"));
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 5. Pizzas de um pedido específico
    public static List<String> pizzasDePedido(int pedidoId) {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT p.nome, ep.tamanho, ep.preco FROM encomenda_pizzas ep " +
                "JOIN pizza p ON ep.pizza_id = p.id " +
                "WHERE ep.encomenda_id = ?";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, pedidoId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                lista.add(rs.getString("nome") + " (" + rs.getString("tamanho") + ") - " + String.format("%.2f", rs.getDouble("preco")) + " €");
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 6. Clientes sem pedidos
    public static List<String> clientesSemPedidos() {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT nome FROM clientes WHERE id NOT IN (SELECT cliente_id FROM encomendas)";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                lista.add(rs.getString("nome"));
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }

    // 7. Média de gasto por cliente
    public static List<String> mediaGastoPorCliente() {
        List<String> lista = new ArrayList<>();
        String sql = "SELECT c.nome, AVG(total_cliente) as media_gasto FROM (" +
                "  SELECT e.cliente_id, SUM(ep.preco) + e.taxa_entrega as total_cliente " +
                "  FROM encomendas e " +
                "  JOIN encomenda_pizzas ep ON e.id = ep.encomenda_id " +
                "  GROUP BY e.id" +
                ") t JOIN clientes c ON t.cliente_id = c.id " +
                "GROUP BY c.id, c.nome ORDER BY media_gasto DESC";
        try (Connection conn = ConexaoBD.ligar();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                lista.add(rs.getString("nome") + " - média: " + String.format("%.2f", rs.getDouble("media_gasto")) + " €");
            }
        } catch (SQLException e) {
            lista.add("Erro: " + e.getMessage());
        }
        return lista;
    }
}