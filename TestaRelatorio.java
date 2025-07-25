package pizzaria;

import java.util.List;

public class TestaRelatorio {
    public static void main(String[] args) {
        System.out.println("Clientes mais frequentes:");
        List<String> topClientes = Relatorio.clientesMaisFrequentes(5);
        topClientes.forEach(System.out::println);

        System.out.println("\nPizzas mais vendidas:");
        Relatorio.pizzasMaisVendidas().forEach(System.out::println);

        System.out.println("\nFaturação por dia (últimos 7 dias):");
        Relatorio.faturacaoPorDia(7).forEach(System.out::println);

        System.out.println("\nPedidos recentes (últimos 3 dias):");
        Relatorio.pedidosRecentes(3).forEach(System.out::println);

        System.out.println("\nPizzas do pedido #1:");
        Relatorio.pizzasDePedido(1).forEach(System.out::println);

        System.out.println("\nClientes sem pedidos:");
        Relatorio.clientesSemPedidos().forEach(System.out::println);

        System.out.println("\nMédia de gasto por cliente:");
        Relatorio.mediaGastoPorCliente().forEach(System.out::println);
    }
}