//! Times the pre-flop odds and percentages natively: `cargo run --release --example bench`

use std::time::Instant;

use poker_hands::{odds, parse_cards, percentages};

fn best_of_three(run: impl Fn()) -> f64 {
    (0..3)
        .map(|_| {
            let start = Instant::now();
            run();
            start.elapsed().as_secs_f64() * 1000.0
        })
        .fold(f64::INFINITY, f64::min)
}

fn main() {
    let all: Vec<_> = [
        "AhAs", "KdKc", "QhJh", "Td9d", "8s8c", "7h6h", "5d4d", "3s3c", "Ac2c", "KhQs",
    ]
    .map(|hole| parse_cards(hole).unwrap())
    .to_vec();
    for players in [2, 3, 5, 10] {
        let ms = best_of_three(|| {
            odds(&all[..players], &[]).unwrap();
        });
        println!("odds pre-flop, {players} players: {ms:.1} ms");
    }
    let hole = parse_cards("AhKh").unwrap();
    let ms = best_of_three(|| {
        percentages(&hole, &[], &[]).unwrap();
    });
    println!("percentages pre-flop: {ms:.1} ms");
}
