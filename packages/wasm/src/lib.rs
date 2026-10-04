//! Texas Hold'em hand ranking and exact odds.
//!
//! ```
//! use poker_hands::{odds, parse_cards};
//!
//! let holes = vec![parse_cards("AhAs").unwrap(), parse_cards("KdKc").unwrap()];
//! let result = odds(&holes, &[]).unwrap();
//! assert_eq!(result.boards, 1_712_304);
//! assert!((result.win_chance(0) - 0.8106).abs() < 0.0001);
//! ```

mod card;
mod error;
mod odds;
mod rank;
#[cfg(target_arch = "wasm32")]
mod wasm;

pub use card::{Card, CardSet, parse_cards};
pub use error::Error;
pub use odds::{HoleTally, Odds, Percentages, odds, percentages};
pub use rank::{HandType, Rank, rank_of};
